import "dotenv/config";
import { defineConfig } from "prisma/config";

const command = process.argv.slice(2).join(" ");
const needsLiveDatabase = /\b(db|migrate|studio)\b/.test(command);
const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

if (!databaseUrl && needsLiveDatabase) {
  throw new Error(
    "DATABASE_URL is required for Prisma database commands. Add it to .env.local before running db:push, migrate, or studio.",
  );
}

if (!directUrl && needsLiveDatabase) {
  throw new Error(
    "DIRECT_URL is required for Prisma database commands against Supabase. Use the direct Postgres connection, not the pooler.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: needsLiveDatabase
      ? directUrl ?? databaseUrl ?? "postgresql://postgres:postgres@localhost:5432/budgetly"
      : databaseUrl ?? directUrl ?? "postgresql://postgres:postgres@localhost:5432/budgetly",
  },
});
