output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.instance_endpoint
}

output "db_url_secret_arns" {
  description = "Secrets Manager ARNs for each service DATABASE_URL"
  value       = module.rds.db_url_secret_arns
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for each service"
  value       = module.ecr.repository_urls
}

output "alb_dns_name" {
  description = "Public DNS name of the ALB — use this to reach the GraphQL API"
  value       = module.alb.alb_dns_name
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "service_discovery_namespace" {
  description = "Cloud Map namespace used for inter-service communication"
  value       = module.ecs.service_discovery_namespace
}
