variable "project" { type = string }
variable "environment" { type = string }

variable "repositories" {
  description = "List of ECR repository names to create"
  type        = list(string)
}

variable "retention_count" {
  description = "Number of images to keep per repository"
  type        = number
  default     = 10
}
