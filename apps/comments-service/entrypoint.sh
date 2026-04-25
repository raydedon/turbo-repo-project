#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
node dist/prisma/seed.js || echo "Seed failed, skipping..."

echo "Starting application..."
exec node dist/src/main.js
