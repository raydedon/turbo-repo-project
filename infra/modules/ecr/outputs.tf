output "repository_urls" {
  description = "Map of repository short name to full ECR URL"
  value       = { for k, v in aws_ecr_repository.this : k => v.repository_url }
}

output "registry_id" {
  description = "AWS account ID (ECR registry ID)"
  value       = values(aws_ecr_repository.this)[0].registry_id
}
