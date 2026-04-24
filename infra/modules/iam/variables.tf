variable "project" { type = string }
variable "environment" { type = string }

variable "secret_arns" {
  description = "Secrets Manager ARNs the ECS task execution role needs to read"
  type        = list(string)
}
