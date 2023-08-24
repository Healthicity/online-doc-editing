# AWS Deployment Guide for deploying InAppDoc


# How to deploy InAppDoc


## VPC:
	The VPC used to deployed InAppDoc is vpc-0e9f9f6373e9a58e2 (Claims-Connect-Development)
	
	Security Group: default SG assigned to Claims Connect
	
	Nat: Default assigned. 

# Ec2 instance InAppDoc-API / Doc-App-API:
 	AMI: ami-08c191625cfb7ee61
	Subnet: The subnet can be public such as subnet-0efb8c8688ee9495c (Claims-Connect-Development-subnet-public1-us-west-2a) on any availability zone. 
	IAM Role: EC2-CodeDeploy
	Security Group: InAppDoc-EC2-SG
	Encryption: EC2 data storage must be encrypted on deployment.


EC2 user data (add cli key/secret):

	#!/bin/bash
	
	#Install Ruby
	echo "Installing Ruby..."
	sudo yum -y update
	sudo yum -y install ruby wget
	echo "Ruby installed successfully."
	sudo yum install -y gcc-c++ make
	curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
	sudo yum install -y nodejs
	
	#Install pm2 globally
	sudo npm install -g pm2
	
	#Install CodeDeploy agent
	echo "Installing CodeDeploy agent..."
	cd /home/centos/
	sudo wget https://aws-codedeploy-us-west-2.s3.amazonaws.com/latest/install
	sudo chmod +x ./install
	sudo ./install auto
	sudo systemctl enable codedeploy-agent
	sudo systemctl start codedeploy-agent
	echo "CodeDeploy agent installed successfully."
	
	#Install Automox
	echo "Installing Automox..."
	curl -sS https://console.automox.com/downloadInstaller?accesskey=748205f4-d7c6-4010-819f-853b3efbbdc6 | sudo bash
	
	#Verify Automox installation
	sudo systemctl is-active --quiet amagent
	
	#Start Automox
	sudo systemctl start amagent
	
	#Verify service is running
	sudo systemctl is-active --quiet amagent
	
	#Restart Automox
	sudo systemctl restart amagent
	echo "Automox installed successfully."
	
	#Install AWS CLI
	echo "Installing AWS CLI..."
	sudo pip3 install awscli
	echo "AWS CLI installed successfully."
	
	#Configure AWS CLI with access keys
	echo "Configuring AWS CLI..."
	aws configure set aws_access_key_id YOUR_ACCESS_KEY
	aws configure set aws_secret_access_key YOUR_SECRET_KEY
	aws configure set default.region us-west-2
	aws configure set output json
	echo "AWS CLI configured successfully."



# Application Load Balancer:

	Load Balancer:
		ALB: Doc-Project-API-ALB
		Listener and rules: HTTPS:3800 
		Target Group: Doc-Project-API-TG
			Target type: Instance
			Protocol: Port: HTTP 3800
Protocol Version: HTTP 1
IP Address Type: IPv4
VPC: vpc-0e9f9f6373e9a58e2
Registered Target: Doc-Project-API – wait until /health responds and status is healthy	
			Certificate: *.healthicity.com or *.qa.healthicity.com

# Auto Scaling Group:

	Not yet configured.
	Build EC2 Template for InAppDoc 
	Configure ASG to use an ec2 template and set the amount of instances.
	Configure Lifecycle and ALB Health checks

# CodePipeline

	Source: Select Github v2 then select repository then branch

	CodeBuild:
		Create build project: Doc-Project-API
		Image: Amazonlinx2 – standard 5.0
		Environment type: Linux EC2
		Compute: Default 3 GB memory, 2vCPU
		Service Role: Doc-Project-API-Codebuild – must have ssmfullacess for parameter
Additional Configuration:
		vpc: vpc-0e9f9f6373e9a58e2
		subnet: subnet-0256a1d186e030ace – subnet must private w/ nat 
		Security Group: sg-0c8f812072c9b7619
		Artifacts: KMS S3 encryption
		Buildspec.yml is included in the repository.	



	Code Deploy: 
		Applications: 
			Create an application or use Doc-Project-App
			There is a preconfigured deployment configuration
			Compute type:EC2/On-premises
			Deployment type: In-place
			Service role: EC2-Codedeploy, or create one with SSM, EC2 and Codeploy 
			Deployment Configuration: All at once
			Environment Configuration: Amazon EC2 instance – type the ec2 name.
			Load Balancer: Doc-Project-API-TG		
			Appspec.yml & Scripts are included in the repository.
