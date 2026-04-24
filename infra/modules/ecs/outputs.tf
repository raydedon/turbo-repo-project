output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "cluster_arn" {
  value = aws_ecs_cluster.this.arn
}

output "service_names" {
  description = "Map of subgraph service name to ECS service name"
  value       = { for k, v in aws_ecs_service.services : k => v.name }
}

output "router_service_name" {
  value = aws_ecs_service.router.name
}

output "service_discovery_namespace" {
  description = "Cloud Map private DNS namespace (e.g. turbo-graphql.local)"
  value       = aws_service_discovery_private_dns_namespace.this.name
}
