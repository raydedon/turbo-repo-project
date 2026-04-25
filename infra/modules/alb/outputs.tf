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

output "acm_validation_records" {
  description = "CNAME records to add to your DNS registrar for ACM validation"
  value = {
    for opt in aws_acm_certificate.this.domain_validation_options : opt.domain_name => {
      name  = opt.resource_record_name
      type  = opt.resource_record_type
      value = opt.resource_record_value
    }
  }
}
