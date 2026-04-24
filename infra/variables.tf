variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "access_key" {
  description = "AWS access key"
  type        = string
}

variable "secret_key" {
  description = "AWS secret key"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "turbo-graphql"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_master_username" {
  description = "Master username for the RDS instance"
  type        = string
  default     = "postgres"
  sensitive   = true
}

# Passed via -var flag or terraform.tfvars (never committed to git)
variable "db_master_password" {
  description = "Master password for the RDS instance"
  type        = string
  sensitive   = true
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to connect to RDS (e.g. your ECS subnets or VPN)"
  type        = list(string)
  default     = ["10.0.0.0/8"]
}

variable "vpc_id" {
  description = "VPC ID where RDS will be placed"
  type        = string
}

variable "subnet_ids" {
  description = "List of private subnet IDs for the RDS subnet group (min 2, different AZs)"
  type        = list(string)
}
