# Quick Start Guide - Database Setup

This guide will get your PostgreSQL database up and running with Drizzle ORM in just a few minutes.

## 🚀 Quick Setup (5 minutes)

### 1. Start the Database
```bash
# Start PostgreSQL container
bun run db:up

# Verify it's running
docker compose ps
```

### 2. Create Environment File
Create a `.env` file in the project root:
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/stream_sub_dev
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=stream_sub_dev
NODE_ENV=development
```

### 3. Generate and Run Migrations
```bash
# Generate migration files from schema
bun run db:generate

# Apply migrations to database
bun run db:migrate
```

### 4. Test the Connection
```bash
# Test database connectivity
bun run db:test

# Or run health check
bun run db:health
```

### 5. Add Sample Data (Optional)
```bash
# Seed database with sample data
bun run db:seed
```

### 6. Explore Your Data
```bash
# Open Drizzle Studio (web-based database browser)
bun run db:studio
```

## 🛠 Available Commands

### Database Management
- `bun run db:up` - Start PostgreSQL container
- `bun run db:down` - Stop PostgreSQL container
- `bun run db:logs` - View database logs
- `bun run db:test` - Test database connection
- `bun run db:health` - Run health check

### Schema & Migrations
- `bun run db:generate` - Generate migration files
- `bun run db:migrate` - Apply migrations
- `bun run db:push` - Push schema directly (dev only)
- `bun run db:studio` - Open database browser
- `bun run db:reset` - Reset database and apply schema

### Data Management
- `bun run db:seed` - Add sample data
- `bun run db:seed clear` - Clear all data
- `bun run db:seed reset` - Clear and re-seed

### Docker Management
- `bun run docker:up` - Start all containers
- `bun run docker:down` - Stop all containers
- `bun run docker:restart` - Restart containers
- `bun run docker:clean` - Clean up containers and volumes

## 📋 Database Schema

Your database includes these tables:

### Users System
- **users** - User accounts and profiles
- **user_sessions** - Authentication sessions
- **user_preferences** - User settings

### Content Organization
- **categories** - Content categories with hierarchy
- **category_tags** - Additional tagging system

## 🔧 Troubleshooting

### Database won't start?
```bash
# Check if port 5432 is in use
lsof -i :5432

# If port is busy, stop other PostgreSQL instances or change port in compose.yml
```

### Connection refused?
```bash
# Make sure container is running
docker compose ps

# Check container logs
bun run db:logs

# Restart container
bun run docker:restart
```

### Migration errors?
```bash
# Reset database and try again
bun run db:reset

# Or manually reset
docker compose down -v
docker compose up -d postgres
bun run db:generate
bun run db:migrate
```

### Permission issues?
```bash
# Make sure environment variables are correct
cat .env

# Test connection with explicit credentials
DATABASE_URL=postgresql://postgres:password@localhost:5432/stream_sub_dev bun run db:test
```

## 🔒 Production Setup

For production environments:

1. **Use strong passwords:**
   ```bash
   DB_PASSWORD=your_super_secure_password_here
   ```

2. **Enable SSL:**
   ```bash
   NODE_ENV=production
   ```

3. **Use connection pooling:**
   The setup already includes optimized connection pooling for production.

4. **Monitor connections:**
   Use the health check endpoints in your application.

## 📖 Next Steps

1. **Add your own tables** to `src/db/schema/`
2. **Generate migrations** with `bun run db:generate`
3. **Apply changes** with `bun run db:migrate`
4. **Create seed data** in `src/db/seed.ts`
5. **Build your application** using the database connection from `src/db/connection.ts`

## 💡 Pro Tips

- Always use migrations for schema changes (never modify tables directly)
- Use `bun run db:studio` to explore and debug your data
- The `db:health` command is perfect for monitoring in production
- Keep your `.env` file secure and never commit it to version control
- Use the test database profile for running tests: `docker compose --profile test up -d postgres-test`

## 📚 Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

🎉 **That's it!** Your database setup is complete and ready for development.