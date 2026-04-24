output "instance_endpoint" {
  description = "RDS instance endpoint (host:port)"
  value       = aws_db_instance.this.endpoint
}

output "instance_address" {
  description = "RDS instance hostname"
  value       = aws_db_instance.this.address
}

output "security_group_id" {
  description = "Security group ID attached to RDS"
  value       = aws_security_group.rds.id
}

output "db_url_secret_arns" {
  description = "Map of service name → Secrets Manager ARN for DATABASE_URL"
  value = {
    for k, v in aws_secretsmanager_secret.db_url : k => v.arn
  }
}
