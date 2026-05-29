#!/bin/sh

echo "⏳ Waiting for database..."

until nc -z postgres 5432; do
  sleep 1
done

echo "🚀 Running migrations..."
npx prisma migrate deploy

echo "✅ Starting server..."
node dist/index.js