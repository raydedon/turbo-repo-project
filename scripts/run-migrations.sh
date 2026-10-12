#!/bin/bash
for SERVICE in users-service posts-service comments-service; do
  aws ecs run-task \
    --cluster turbo-graphql-production \
    --task-definition "turbo-graphql-production-${SERVICE}-migrate" \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-0f265e64bdfb9fb81,subnet-0774467101198569e,subnet-05e65717973969d81],securityGroups=[sg-03432f226e44a3890],assignPublicIp=ENABLED}" \
    --region ap-southeast-2
done
