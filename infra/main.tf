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
