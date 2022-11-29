resource "aws_security_group" "lb" {
  name = "${terraform.workspace}-lb-sec-group"
  vpc_id = data.aws_vpc.vpc.id

  ingress {
    from_port = 3000
    protocol = "tcp"
    to_port = 3000
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 3000
    protocol = "TCP"
    to_port = 3000
    cidr_blocks = [data.aws_vpc.vpc.cidr_block]
  }
}

resource "aws_security_group" "app" {
  name = "${terraform.workspace}-app-sec-group"
  vpc_id = data.aws_vpc.vpc.id

  ingress {
    from_port = 3000
    protocol = "tcp"
    to_port = 3000
    security_groups = [aws_security_group.lb.id]
  }

  ingress {
    from_port = 22
    protocol = "tcp"
    to_port = 22
    cidr_blocks = [data.aws_vpc.vpc.cidr_block]
  }

  egress {
    from_port = 0
    protocol = "TCP"
    to_port = 65535
    cidr_blocks = ["0.0.0.0/0"]
  }
}
