variable "project" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "alb_sg_id" { type = string }

variable "router_port" {
  type    = number
  default = 4000
}
