import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import * as schemaSqlite from "@shared/schema-sqlite";
import path from 'path';
import fs from 'fs';

// Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Use SQLite for development, PostgreSQL for production
const isDevelopment = process.env.NODE_ENV === 'development';

let db: ReturnType<typeof drizzle>;

if (isDevelopment) {
  // SQLite for development
  const dbPath = path.join(dbDir, 'eduverse.db');
  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema: schemaSqlite });
  console.log(`Using SQLite database at: ${dbPath}`);
} else {
  // PostgreSQL for production
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set for production. Did you forget to provision a database?",
    );
  }
  
  // Import Neon dependencies only in production
  const { Pool, neonConfig } = require('@neondatabase/serverless');
  const { drizzle: drizzleNeon } = require('drizzle-orm/neon-serverless');
  const ws = require("ws");
  
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
  console.log('Using PostgreSQL database');
}

export { db };
