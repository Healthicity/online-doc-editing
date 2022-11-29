resource "aws_launch_configuration" "app" {
  name_prefix          = "app-"
  image_id             = data.aws_ami.image.id
  instance_type        = var.instance_type
  user_data            = file("${path.module}/user_data.sh")
  key_name             = "healthcare-integration-${terraform.workspace}"
  iam_instance_profile = "ssmInstanceProfile-${terraform.workspace}"
  security_groups      = [aws_security_group.app.id]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "app" {
  name                      = "${terraform.workspace}-${aws_launch_configuration.app.name}"
  max_size                  = 1
  min_size                  = 1
  desired_capacity          = 1
  health_check_grace_period = "300"
  health_check_type         = "ELB"
  vpc_zone_identifier       = data.aws_subnet_ids.private.ids
  target_group_arns         = [aws_lb_target_group.app.arn]
  termination_policies      = ["OldestInstance"]
  launch_configuration      = aws_launch_configuration.app.id
  tag {
    key                 = "Name"
    propagate_at_launch = true
    value               = "${terraform.workspace}-microservice-instance"
  }
  tag {
    key                 = "env"
    propagate_at_launch = true
    value               = lower(terraform.workspace)
  }

  lifecycle {
    create_before_destroy = true
  }
}
