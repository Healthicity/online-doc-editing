resource "aws_lb" "alb" {
  name               = "${terraform.workspace}-microservice-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnet_ids.public.ids
  security_groups    = [aws_security_group.lb.id]
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "3000"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.certificate.arn
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

resource "aws_lb_target_group" "app" {
  name        = "${terraform.workspace}-target-group"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.vpc.id
  target_type = "instance"
  health_check {
    path     = "/health"
    matcher  = "200"
    interval = "30"
  }
}

resource "aws_route53_record" "lb" {
  name    = terraform.workspace == "prod" ? "api.globalesm.com" : lower("api.${terraform.workspace}.globalesm.com")
  type    = "A"
  zone_id = data.aws_route53_zone.zone.id

  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = false
  }
}
