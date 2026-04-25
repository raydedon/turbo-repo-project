variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
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

variable "image_tag" {
  description = "Docker image tag to deploy across all services"
  type        = string
  default     = "latest"
}

variable "ecs_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Fargate task memory in MB"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired number of running ECS tasks per service"
  type        = number
  default     = 1
}

variable "domain_name" {
  description = "Subdomain for the GraphQL API (e.g. api.animeshray.space)"
  type        = string
  default     = "graphql.animeshray.space"
}
