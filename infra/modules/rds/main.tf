# ─── Subnet group ────────────────────────────────────────────────────────────

resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-${var.environment}-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.project}-${var.environment}-subnet-group"
    Environment = var.environment
  }
}

# ─── Security group ───────────────────────────────────────────────────────────

resource "aws_security_group" "rds" {
  name        = "${var.project}-${var.environment}-rds-sg"
  description = "Allow PostgreSQL from application layer"
  vpc_id      = var.vpc_id

  ingress {
    description = "PostgreSQL"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project}-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

# ─── Master password in Secrets Manager ──────────────────────────────────────

resource "aws_secretsmanager_secret" "master_password" {
  name                    = "${var.project}/${var.environment}/rds/master-password"
  description             = "RDS master password for ${var.project}"
  recovery_window_in_days = 7

  tags = {
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "master_password" {
  secret_id     = aws_secretsmanager_secret.master_password.id
  secret_string = var.db_master_password
}

# ─── Per-service DATABASE_URL secrets ────────────────────────────────────────
# These are what your ECS task definitions reference at runtime.

locals {
  databases = {
    posts    = "posts_db"
    comments = "comments_db"
    users    = "users_db"
  }
}

resource "aws_secretsmanager_secret" "db_url" {
  for_each = local.databases

  name                    = "${var.project}/${var.environment}/${each.key}/DATABASE_URL"
  description             = "DATABASE_URL for ${each.key} service"
  recovery_window_in_days = 7

  tags = {
    Service     = each.key
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_url" {
  for_each = local.databases

  secret_id = aws_secretsmanager_secret.db_url[each.key].id

  # Connection string each service will use.
  # The databases themselves are created by the init Lambda below.
  secret_string = "postgresql://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.this.endpoint}/${each.value}?schema=public"

  depends_on = [aws_db_instance.this]
}

# ─── RDS Instance ─────────────────────────────────────────────────────────────

resource "aws_db_instance" "this" {
  identifier = "${var.project}-${var.environment}-postgres"

  engine         = "postgres"
  engine_version = "15"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_allocated_storage * 5  # auto-scaling cap
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "postgres"  # default DB; service DBs created via init Lambda
  username = var.db_master_username
  password = var.db_master_password

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az               = var.environment == "production" ? true : false
  publicly_accessible    = false
  deletion_protection    = var.environment == "production" ? true : false
  skip_final_snapshot    = var.environment == "production" ? false : true
  final_snapshot_identifier = var.environment == "production" ? "${var.project}-${var.environment}-final-snapshot" : null

  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"

  performance_insights_enabled = true
  monitoring_interval          = 60
  monitoring_role_arn          = aws_iam_role.rds_monitoring.arn

  tags = {
    Name        = "${var.project}-${var.environment}-postgres"
    Environment = var.environment
  }
}

# ─── Enhanced monitoring IAM role ────────────────────────────────────────────

resource "aws_iam_role" "rds_monitoring" {
  name = "${var.project}-${var.environment}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ─── Lambda: create databases on first run ───────────────────────────────────
# Runs once inside the VPC to CREATE DATABASE for each service.

resource "local_file" "db_init_handler" {
  filename = "${path.module}/lambda_build/handler.py"
  content  = <<-PYTHON
import psycopg2
import os

def handler(event, context):
    conn = psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=5432,
        dbname="postgres",
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        connect_timeout=10,
    )
    conn.autocommit = True
    cur = conn.cursor()

    for db in ["posts_db", "comments_db", "users_db"]:
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db,))
        if not cur.fetchone():
            cur.execute(f'CREATE DATABASE "{db}"')
            print(f"Created database: {db}")
        else:
            print(f"Database already exists: {db}")

    cur.close()
    conn.close()
    return {"statusCode": 200, "body": "Done"}
PYTHON
}

resource "null_resource" "pip_install" {
  triggers = {
    handler_hash = local_file.db_init_handler.content_md5
    pip_platform = "manylinux2014_x86_64-py3.12"
  }

  provisioner "local-exec" {
    command = "pip install psycopg2-binary -t ${path.module}/lambda_build/ -q --platform manylinux2014_x86_64 --only-binary=:all: --python-version 3.12"
  }

  depends_on = [local_file.db_init_handler]
}

data "archive_file" "db_init" {
  type        = "zip"
  source_dir  = "${path.module}/lambda_build"
  output_path = "${path.module}/db_init.zip"

  depends_on = [null_resource.pip_install]
}

resource "aws_iam_role" "db_init_lambda" {
  name = "${var.project}-${var.environment}-db-init-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "db_init_lambda" {
  name = "db-init-policy"
  role = aws_iam_role.db_init_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["ec2:CreateNetworkInterface", "ec2:DescribeNetworkInterfaces", "ec2:DeleteNetworkInterface"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_lambda_function" "db_init" {
  function_name    = "${var.project}-${var.environment}-db-init"
  filename         = data.archive_file.db_init.output_path
  source_code_hash = data.archive_file.db_init.output_base64sha256
  handler          = "handler.handler"
  runtime          = "python3.12"
  timeout          = 60
  role             = aws_iam_role.db_init_lambda.arn

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.rds.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.this.address
      DB_USER     = var.db_master_username
      DB_PASSWORD = var.db_master_password
    }
  }

  depends_on = [aws_db_instance.this]
}

# Invoke the Lambda once after apply to create the databases
resource "aws_lambda_invocation" "db_init" {
  function_name = aws_lambda_function.db_init.function_name
  input         = jsonencode({})

  depends_on = [aws_lambda_function.db_init]
}
