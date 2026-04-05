variable "project_name" {
  description = "Project name used as prefix for AWS resources"
  type        = string
  default     = "resumebuilder"
}

variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "instance_type" {
  description = "EC2 instance type for Docker Compose host"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing EC2 key pair name for SSH access"
  type        = string
  default     = null
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH into the EC2 instance"
  type        = string
  default     = "0.0.0.0/0"
}

variable "frontend_port" {
  description = "Host port on EC2 where frontend container is exposed"
  type        = number
  default     = 80
}

variable "backend_port" {
  description = "Host port on EC2 where backend container is exposed"
  type        = number
  default     = 4000
}

variable "backend_image" {
  description = "Backend image name with tag"
  type        = string
  default     = "2004369/resumebuilder-backend:latest"
}

variable "frontend_image" {
  description = "Frontend image name with tag"
  type        = string
  default     = "2004369/resumebuilder-frontend:latest"
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "redis_url" {
  description = "Upstash Redis URL"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret used by backend"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "Comma-separated origins for backend CORS allowlist"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "Optional ACM certificate ARN. If set, HTTPS listener is created"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags applied to resources"
  type        = map(string)
  default     = {}
}
