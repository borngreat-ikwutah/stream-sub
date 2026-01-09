import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

// Database connection configuration
const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "stream_sub_dev",
  ssl: process.env.NODE_ENV === "production",
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  max_lifetime: 60 * 30, // Close connections after 30 minutes
  transform: {
    undefined: null, // Transform undefined values to null
  },
};

// Create connection string for fallback
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${connectionConfig.username}:${connectionConfig.password}@${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`;

// Create the postgres client using connection string
const client = postgres(connectionString, {
  ssl: connectionConfig.ssl,
  max: connectionConfig.max,
  idle_timeout: connectionConfig.idle_timeout,
  max_lifetime: connectionConfig.max_lifetime,
  transform: connectionConfig.transform,
  // Disable prepared statements for better AWS Lambda compatibility
  prepare: false,
});

// Create the drizzle database instance with schema
export const db = drizzle({ client, schema });

// Export types for use throughout the application
export type DB = typeof db;
export type Schema = typeof schema;

// Export the client for direct access if needed
export { client };

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

// Graceful shutdown handler
export async function closeConnection(): Promise<void> {
  try {
    await client.end();
    console.log("Database connection closed gracefully");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}

// Setup graceful shutdown for Node.js processes
if (typeof process !== "undefined") {
  const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`Received ${signal}, closing database connection...`);
      await closeConnection();
      process.exit(0);
    });
  });

  // Handle uncaught exceptions
  process.on("beforeExit", async () => {
    await closeConnection();
  });
}

// Export connection utilities
export const connectionUtils = {
  healthCheck,
  closeConnection,
  isConnected: () => {
    try {
      // Check if client exists and hasn't been ended
      return client && typeof client.end === "function";
    } catch {
      return false;
    }
  },
  getConnectionString: () => connectionString,
};
