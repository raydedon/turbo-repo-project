#!/bin/bash
set -e

CLUSTER=turbo-graphql-production
REGION=ap-south-1

for SERVICE in users-service posts-service comments-service apollo-router; do
  echo "Redeploying $SERVICE..."
  aws ecs update-service \
    --cluster $CLUSTER \
    --service ${CLUSTER}-${SERVICE} \
    --force-new-deployment \
    --region $REGION \
    --output text \
    --query 'service.serviceName'
done

echo "All services redeployed."
