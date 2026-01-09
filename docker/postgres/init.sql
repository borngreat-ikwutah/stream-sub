-- PostgreSQL initialization script for stream-sub application
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful for the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create a custom schema for the application (optional)
-- CREATE SCHEMA IF NOT EXISTS app;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE stream_sub_dev TO postgres;

-- You can add any initial data or additional setup here
-- For example, creating initial admin users, seed data, etc.

-- Example: Create a simple health check function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TEXT AS $$
BEGIN
    RETURN 'OK';
END;
$$ LANGUAGE plpgsql;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL database initialized successfully for stream-sub application';
END
$$;
