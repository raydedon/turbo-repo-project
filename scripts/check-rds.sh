#!/bin/bash
aws rds modify-db-instance --db-instance-identifier turbo-graphql-production-postgres --publicly-accessible --apply-immediately --region ap-south-1

aws rds wait db-instance-available --db-instance-identifier turbo-graphql-production-postgres --region ap-south-1

aws ec2 authorize-security-group-ingress --group-id sg-06785c5e0ed6c1513 --protocol tcp --port 5432 --cidr 223.233.82.37/32 --region ap-south-1

#aws ec2 revoke-security-group-ingress --group-id sg-06785c5e0ed6c1513 --protocol tcp --port 5432 --cidr 223.233.82.37/32 --region ap-south-1

#aws rds modify-db-instance --db-instance-identifier turbo-graphql-production-postgres --no-publicly-accessible --apply-immediately --region ap-south-1
