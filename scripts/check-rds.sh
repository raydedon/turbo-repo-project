#!/bin/bash
aws rds modify-db-instance --db-instance-identifier turbo-graphql-production-postgres --publicly-accessible --apply-immediately --region ap-southeast-2

aws rds wait db-instance-available --db-instance-identifier turbo-graphql-production-postgres --region ap-southeast-2

aws ec2 authorize-security-group-ingress --group-id sg-0dd8ccbb2c63b1f04 --protocol tcp --port 5432 --cidr 223.233.82.37/32 --region ap-southeast-2

#aws ec2 revoke-security-group-ingress --group-id sg-0dd8ccbb2c63b1f04 --protocol tcp --port 5432 --cidr 223.233.82.37/32 --region ap-southeast-2

#aws rds modify-db-instance --db-instance-identifier turbo-graphql-production-postgres --no-publicly-accessible --apply-immediately --region ap-southeast-2
