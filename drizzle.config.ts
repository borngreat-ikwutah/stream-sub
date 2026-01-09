import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Use PostgreSQL dialect
  dialect: "postgresql",

  // Schema files location
  schema: "./src/db/schema/index.ts",

  // Migration output directory
  out: "./drizzle",

  // Database connection configuration
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "stream_sub_dev"}`,
  },

  // Enhanced configuration options
  verbose: true,
  strict: true,

  // Additional PostgreSQL specific options
  schemaFilter: ["public"],
  tablesFilter: ["!__drizzle_migrations__"],
});
