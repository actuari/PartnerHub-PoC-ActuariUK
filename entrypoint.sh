#!/bin/sh
echo "Waiting for database..."
until nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
npx prisma migrate deploy

echo "Building Next.js..."
npm run build || true

echo "Starting server..."
npm run start