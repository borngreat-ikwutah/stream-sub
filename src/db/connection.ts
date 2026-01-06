import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create the connection string
const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'admin_dashboard'}`;

// Create the postgres client
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

// Create the drizzle instance
export const db = drizzle(client);

export type DB = typeof db;

export { client };

// For graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await client.end();
  });
}
