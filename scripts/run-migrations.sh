#!/bin/bash
for SERVICE in users-service posts-service comments-service; do
  aws ecs run-task \
    --cluster turbo-graphql-production \
    --task-definition "turbo-graphql-production-${SERVICE}-migrate" \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-08b8036d1f95e3cf7,subnet-0c5232e2073af7310,subnet-07a57c2b3ea82adec],securityGroups=[sg-0d0538742dade05d1],assignPublicIp=ENABLED}" \
    --region ap-south-1
done
