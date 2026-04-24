module "rds" {
  source = "./modules/rds"

  project     = var.project
  environment = var.environment

  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids

  allowed_cidr_blocks  = var.allowed_cidr_blocks
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_master_username   = var.db_master_username
  db_master_password   = var.db_master_password
}

module "ecr" {
  source = "./modules/ecr"

  project     = var.project
  environment = var.environment
  repositories = [
    "users-service",
    "posts-service",
    "comments-service",
    "apollo-router",
  ]
}

module "iam" {
  source = "./modules/iam"

  project     = var.project
  environment = var.environment
  secret_arns = values(module.rds.db_url_secret_arns)
}

module "networking" {
  source = "./modules/networking"

  project     = var.project
  environment = var.environment
  vpc_id      = var.vpc_id
}

module "alb" {
  source = "./modules/alb"

  project    = var.project
  environment = var.environment
  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids
  alb_sg_id  = module.networking.alb_sg_id
}

module "ecs" {
  source = "./modules/ecs"

  project    = var.project
  environment = var.environment
  aws_region = var.aws_region
  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids

  ecs_sg_id               = module.networking.ecs_sg_id
  execution_role_arn      = module.iam.ecs_task_execution_role_arn
  router_target_group_arn = module.alb.router_target_group_arn

  image_tag     = var.image_tag
  ecs_cpu       = var.ecs_cpu
  ecs_memory    = var.ecs_memory
  desired_count = var.desired_count

  services = {
    users-service    = { port = 4001, db_secret_arn = module.rds.db_url_secret_arns["users"] }
    posts-service    = { port = 4002, db_secret_arn = module.rds.db_url_secret_arns["posts"] }
    comments-service = { port = 4003, db_secret_arn = module.rds.db_url_secret_arns["comments"] }
  }
}
