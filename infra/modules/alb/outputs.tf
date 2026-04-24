output "alb_dns_name" {
  description = "Public DNS name of the ALB"
  value       = aws_lb.this.dns_name
}

output "alb_arn" {
  value = aws_lb.this.arn
}

output "router_target_group_arn" {
  description = "Target group ARN for the Apollo Router"
  value       = aws_lb_target_group.router.arn
}
