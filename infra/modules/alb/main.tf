locals {
  # ALB target group names are limited to 32 characters
  tg_prefix = substr("${var.project}-${var.environment}", 0, 20)
}

resource "aws_lb" "this" {
  name               = "${var.project}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.subnet_ids

  tags = {
    Name        = "${var.project}-${var.environment}-alb"
    Environment = var.environment
  }
}

# Apollo Router is the single public-facing entry point
resource "aws_lb_target_group" "router" {
  name        = "${local.tg_prefix}-router-tg"
  port        = var.router_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name        = "${var.project}-${var.environment}-router-tg"
    Environment = var.environment
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.router.arn
  }
}
