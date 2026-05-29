import * as dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';
dotenv.config();

export default defineConfig({
  schema: 'infrastructure/database/prisma/schema',
  migrations: {
    path: 'infrastructure/database/prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});