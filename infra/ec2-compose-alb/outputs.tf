output "alb_dns_name" {
  description = "Public ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "app_url" {
  description = "Application URL (HTTP unless certificate_arn is set)"
  value       = var.certificate_arn == "" ? "http://${aws_lb.main.dns_name}" : "https://${aws_lb.main.dns_name}"
}

output "ec2_public_ip" {
  description = "EC2 public IP for SSH troubleshooting"
  value       = aws_instance.app.public_ip
}

output "ssh_command" {
  description = "SSH command template (replace key path)"
  value       = var.key_name == null ? "No key_name provided" : "ssh -i <path-to-key.pem> ec2-user@${aws_instance.app.public_ip}"
}
