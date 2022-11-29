variable "commit" {
  description = "commit id used to create image deployment"
}

variable "instance_type" {
  description = "ec2 instance type apps should be"
  default     = "t2.small"
}

