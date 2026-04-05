# AWS Demo Deployment (EC2 + Docker Compose + ALB)

This Terraform stack deploys your Resume Builder in AWS using:

- 1 EC2 instance (Docker Compose host)
- 1 Application Load Balancer (ALB)
- 1 VPC with 2 public subnets
- Security groups for ALB and EC2

This is ideal for demo/showcase use. It is intentionally simple and low-ops.

## Architecture

1. ALB receives public traffic on port 80 (and 443 if certificate is provided).
2. ALB forwards traffic to EC2 on frontend port (default: 80).
3. EC2 runs Docker Compose with two containers:
   - frontend container (nginx)
   - backend container (node/express)
4. Frontend container proxies `/api/*` and `/uploads/*` to backend container.

## Before You Apply

1. Ensure Docker images exist in Docker Hub:
   - `2004369/resumebuilder-backend:latest`
   - `2004369/resumebuilder-frontend:latest`
2. Create an EC2 key pair in your AWS region.
3. Know your public IP for SSH CIDR (example: `1.2.3.4/32`).

## Deploy

```bash
cd infra/ec2-compose-alb
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with real values

terraform init
terraform plan
terraform apply
```

After apply, Terraform prints:

- `app_url` (use this for demo)
- `alb_dns_name`
- `ec2_public_ip`

## Destroy

```bash
terraform destroy
```

## Notes

- Current upload storage is local to EC2 volume (`/app/uploads` inside Docker volume).
- For production durability, migrate uploads to S3.
- `ssh_allowed_cidr` should be your IP, not `0.0.0.0/0`.
