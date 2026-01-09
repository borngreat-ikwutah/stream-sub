#!/usr/bin/env tsx

import {
  healthCheck,
  connectionUtils,
  closeConnection,
} from "../db/connection.js";

async function runHealthCheck(): Promise<void> {
  console.log("🏥 Running database health check...\n");

  try {
    // Test basic connectivity
    console.log("1. Testing database connection...");
    const isHealthy = await healthCheck();

    if (isHealthy) {
      console.log("✅ Database connection is healthy");
    } else {
      console.log("❌ Database connection failed");
      process.exit(1);
    }

    // Test connection state
    console.log("\n2. Checking connection state...");
    const isConnected = connectionUtils.isConnected();
    console.log(
      `   Connection state: ${isConnected ? "✅ Connected" : "❌ Disconnected"}`,
    );

    // Show connection details (without sensitive info)
    console.log("\n3. Connection details:");
    const connectionString = connectionUtils.getConnectionString();
    const sanitizedConnection = connectionString.replace(
      /\/\/.*:.*@/,
      "//***:***@",
    );
    console.log(`   Connection: ${sanitizedConnection}`);

    // Test query execution
    console.log("\n4. Testing query execution...");
    const { db } = await import("../db/connection.js");
    const result = await db.execute(
      "SELECT NOW() as current_time, version() as pg_version",
    );

    if (result && result.length > 0) {
      const row = result[0] as any;
      console.log("✅ Query execution successful");
      console.log(`   Current time: ${row.current_time}`);
      console.log(`   PostgreSQL version: ${row.pg_version}`);
    }

    // Test schema access
    console.log("\n5. Testing schema access...");
    try {
      const tablesResult = await db.execute(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      console.log("✅ Schema access successful");
      console.log(
        `   Found ${tablesResult?.length || 0} tables in public schema`,
      );

      if (tablesResult && tablesResult.length > 0) {
        const tables = tablesResult.map((row: any) => row.table_name);
        console.log(`   Tables: ${tables.join(", ")}`);
      }
    } catch (error) {
      console.log("⚠️  Schema access limited or no tables exist yet");
    }

    // Test migrations table
    console.log("\n6. Checking migrations status...");
    try {
      const migrationsResult = await db.execute(`
        SELECT COUNT(*) as migration_count
        FROM __drizzle_migrations__
      `);

      if (migrationsResult && migrationsResult.length > 0) {
        const count = (migrationsResult[0] as any).migration_count;
        console.log(`✅ Found ${count} applied migrations`);
      }
    } catch (error) {
      console.log(
        "ℹ️  No migration history found (run 'bun run db:generate && bun run db:migrate')",
      );
    }

    console.log("\n🎉 Health check completed successfully!");
  } catch (error) {
    console.error("\n💥 Health check failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck().catch((error) => {
    console.error("Health check script failed:", error);
    process.exit(1);
  });
}

export { runHealthCheck };
