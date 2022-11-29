terraform {
  backend "s3" {
    bucket = "globalesm-healthcare-integration-tf-state"
    region = "us-east-1"
    key = "app-tf-state"
    workspace_key_prefix = "app-tf-state"
  }
}
provider "aws" {
  region = "us-east-1"
}
