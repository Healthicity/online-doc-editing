data "aws_vpc" "vpc" {
  filter {
    name   = "tag:Name"
    values = ["healthcare-integration-${terraform.workspace}"]
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.vpc.id
  filter {
    name   = "tag:Name"
    values = ["*public*"]
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.vpc.id
  filter {
    name   = "tag:Name"
    values = ["*private*"]
  }
}

data "aws_ami" "image" {
  most_recent = true
  owners      = ["self"]
  filter {
    name   = "name"
    values = ["${terraform.workspace}-${var.commit}-app-image"]
  }
}

data "aws_acm_certificate" "certificate" {
  domain = terraform.workspace == "prod" ? "*.globalesm.com" : lower("*.${terraform.workspace}.globalesm.com")
}

data "aws_route53_zone" "zone" {
  name = "globalesm.com"
}
