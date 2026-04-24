output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.instance_endpoint
}

output "db_url_secret_arns" {
  description = "Secrets Manager ARNs for each service DATABASE_URL"
  value       = module.rds.db_url_secret_arns
}
