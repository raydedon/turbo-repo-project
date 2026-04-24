variable "project" { type = string }
variable "environment" { type = string }
variable "aws_region" { type = string }
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "ecs_sg_id" { type = string }
variable "execution_role_arn" { type = string }
variable "router_target_group_arn" { type = string }

variable "services" {
  description = "Map of subgraph service name to port and DATABASE_URL secret ARN"
  type = map(object({
    port          = number
    db_secret_arn = string
  }))
}

variable "router_port" {
  type    = number
  default = 4000
}

variable "image_tag" {
  description = "Docker image tag to deploy"
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
  description = "Desired number of running tasks per service"
  type        = number
  default     = 1
}
