import { defineConfig } from "drizzle-kit";
import path from "path";

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
  out: "./migrations",
  schema: isDevelopment ? "./shared/schema-sqlite.ts" : "./shared/schema.ts",
  dialect: isDevelopment ? "sqlite" : "postgresql",
  dbCredentials: isDevelopment 
    ? {
        url: path.join(process.cwd(), 'data', 'eduverse.db')
      }
    : {
        url: process.env.DATABASE_URL!,
      },
});
