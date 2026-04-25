data "aws_caller_identity" "current" {}

locals {
  ecr_base = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.project}"
  namespace = "${var.project}.local"
}

# ── ECS Cluster ───────────────────────────────────────────────────────────────

resource "aws_ecs_cluster" "this" {
  name = "${var.project}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project}-${var.environment}"
    Environment = var.environment
  }
}

# ── Cloud Map — private DNS for Router → Subgraph discovery ──────────────────

resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = local.namespace
  description = "Private DNS namespace for ${var.project} ECS services"
  vpc         = var.vpc_id
}

resource "aws_service_discovery_service" "services" {
  for_each = var.services
  name     = each.key

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id
    dns_records {
      ttl  = 10
      type = "A"
    }
    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ── CloudWatch Log Groups ─────────────────────────────────────────────────────

resource "aws_cloudwatch_log_group" "services" {
  for_each          = var.services
  name              = "/ecs/${var.project}/${each.key}"
  retention_in_days = 14
  tags              = { Environment = var.environment }
}

resource "aws_cloudwatch_log_group" "router" {
  name              = "/ecs/${var.project}/apollo-router"
  retention_in_days = 14
  tags              = { Environment = var.environment }
}

# ── Subgraph Task Definitions ─────────────────────────────────────────────────

resource "aws_ecs_task_definition" "services" {
  for_each = var.services

  family                   = "${var.project}-${var.environment}-${each.key}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = var.execution_role_arn

  container_definitions = jsonencode([{
    name      = "app"
    image     = "${local.ecr_base}/${each.key}:${var.image_tag}"
    essential = true

    portMappings = [{
      containerPort = each.value.port
      protocol      = "tcp"
    }]

    environment = [
      { name = "PORT",     value = tostring(each.value.port) },
      { name = "NODE_ENV", value = "production" }
    ]

    secrets = [{
      name      = "DATABASE_URL"
      valueFrom = each.value.db_secret_arn
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.project}/${each.key}"
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost:${each.value.port}/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])

  tags = { Environment = var.environment }
}

# Migration task definition — same image, overridden command in CI/CD
resource "aws_ecs_task_definition" "migrate" {
  for_each = var.services

  family                   = "${var.project}-${var.environment}-${each.key}-migrate"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = var.execution_role_arn

  container_definitions = jsonencode([{
    name      = "app"
    image     = "${local.ecr_base}/${each.key}:${var.image_tag}"
    essential = true

    command = ["npx", "prisma", "migrate", "deploy"]

    environment = [
      { name = "NODE_ENV", value = "production" }
    ]

    secrets = [{
      name      = "DATABASE_URL"
      valueFrom = each.value.db_secret_arn
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.project}/${each.key}"
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "migrate"
      }
    }
  }])

  tags = { Environment = var.environment }
}

# ── Apollo Router Task Definition ─────────────────────────────────────────────

resource "aws_ecs_task_definition" "router" {
  family                   = "${var.project}-${var.environment}-apollo-router"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = var.execution_role_arn

  container_definitions = jsonencode([{
    name      = "router"
    image     = "${local.ecr_base}/apollo-router:${var.image_tag}"
    essential = true

    portMappings = [{
      containerPort = var.router_port
      protocol      = "tcp"
    }]

    environment = [
      { name = "APOLLO_ROUTER_SUPERGRAPH_PATH", value = "/dist/schema/supergraph.graphql" },
      { name = "APOLLO_ROUTER_CONFIG_PATH",     value = "/dist/config/router.yaml" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.project}/apollo-router"
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${var.router_port}/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 30
    }
  }])

  tags = { Environment = var.environment }
}

# ── ECS Services — Subgraphs (registered with Cloud Map) ─────────────────────

resource "aws_ecs_service" "services" {
  for_each = var.services

  name            = "${var.project}-${var.environment}-${each.key}"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.services[each.key].arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_sg_id]
    assign_public_ip = true  # required to pull from ECR in public subnets without NAT
  }

  service_registries {
    registry_arn = aws_service_discovery_service.services[each.key].arn
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  tags = { Environment = var.environment }
}

# ── ECS Service — Apollo Router (registered with ALB) ────────────────────────

resource "aws_ecs_service" "router" {
  name            = "${var.project}-${var.environment}-apollo-router"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.router.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_sg_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.router_target_group_arn
    container_name   = "router"
    container_port   = var.router_port
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  tags = { Environment = var.environment }
}
