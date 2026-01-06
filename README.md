# Admin Dashboard

A clean, modern admin dashboard built with **TanStack Start**, **Tailwind CSS v3**, and **Drizzle ORM** with **PostgreSQL**.

## 🚀 Features

- **TanStack Start**: Full-stack React framework with file-based routing and SSR
- **Tailwind CSS v3**: Utility-first CSS framework with custom design system
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migrations
- **TypeScript**: Full type safety throughout the application
- **Clean Architecture**: Organized project structure ready for expansion

## 📋 Prerequisites

- **Node.js 18+** or **Bun**
- **PostgreSQL** database (local or remote)

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd easy-ledger

# Install dependencies
npm install
# or
bun install
```

### 2. Database Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### 3. Database Migration

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:push

# Optional: Open Drizzle Studio (database GUI)
npm run db:studio
```

### 4. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
easy-ledger/
├── src/
│   ├── db/                    # Database layer
│   │   ├── schema/           # Database schemas
│   │   │   ├── users.ts      # User table schema
│   │   │   ├── products.ts   # Product table schema
│   │   │   ├── categories.ts # Category table schema
│   │   │   └── index.ts      # Schema exports
│   │   ├── connection.ts     # Database connection
│   │   └── queries.ts        # Pre-built query functions
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── routes/               # File-based routing
│   │   ├── __root.tsx       # Root layout
│   │   └── index.tsx        # Home page
│   ├── styles/
│   │   └── app.css          # Tailwind styles & custom components
│   └── components/           # React components (expandable)
├── drizzle.config.ts         # Drizzle ORM configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🗄️ Database Schema

The application includes three basic schemas to get you started:

- **`users`** - User management with basic fields
- **`products`** - Product catalog with pricing and inventory
- **`categories`** - Product categorization with hierarchy support

### Adding New Tables

1. **Create schema file** in `src/db/schema/your-table.ts`
2. **Export from** `src/db/schema/index.ts`
3. **Generate migration**: `npm run db:generate`
4. **Apply to database**: `npm run db:push`

Example schema:
```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

## 🎨 Styling System

Built with **Tailwind CSS v3** and a custom design system:

### Custom Color Palette
```css
primary: { 100: '#ffffff', 900: '#1a1a1a' }
secondary: { 100: '#666666', 700: '#4d4d4d', 900: '#b3b3b3' }
tertiary: { 100: '#666666', 400: '#4d4d4d' }
```

### Component Classes
- `.btn-primary` - Primary button styling
- `.btn-light` - Secondary button styling
- `.input` - Form input styling
- `.sidebar` - Sidebar navigation styling

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate database migrations |
| `npm run db:push` | Apply schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 💾 Database Operations

Use the pre-built query functions for common operations:

```typescript
import { userQueries, productQueries, categoryQueries } from '~/db/queries';

// Users
const users = await userQueries.getAll();
const user = await userQueries.getById(1);
const newUser = await userQueries.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Products
const products = await productQueries.getAll({
  search: 'laptop',
  active: true,
  limit: 10
});

// Categories
const categories = await categoryQueries.getAll();
```

## 🌍 Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=admin_dashboard

# Application
NODE_ENV=development
PORT=3000
```

## 🚀 Deployment

### Build & Deploy

```bash
# 1. Build the application
npm run build

# 2. Set production environment variables
export DATABASE_URL="your-production-db-url"

# 3. Run database migrations
npm run db:push

# 4. Start production server
npm run start
```

### Platform-Specific Guides

- **Vercel**: Connect repo, set environment variables, deploy
- **Railway**: Connect GitHub, add PostgreSQL addon, deploy
- **Render**: Web service + PostgreSQL database setup
- **DigitalOcean**: App Platform with managed database

## 🏗️ Architecture Decisions

### Why TanStack Start?
- **Full-stack** React framework
- **File-based routing** for intuitive structure
- **Server-side rendering** for better performance
- **Type-safe** API routes

### Why Drizzle ORM?
- **Type safety** with TypeScript
- **SQL-like** syntax that's easy to learn
- **Migration system** for database versioning
- **Performance** optimized queries

### Why Tailwind CSS?
- **Utility-first** for rapid development
- **Consistent** design system
- **Small bundle** size with purging
- **Customizable** design tokens

## 📚 Next Steps

1. **Add Authentication** - Implement user login/signup
2. **Build Dashboard** - Create admin panels and charts
3. **Add API Routes** - Build REST endpoints with TanStack Start
4. **Implement CRUD** - Full create/read/update/delete operations
5. **Add Validation** - Form validation with Zod
6. **Setup Testing** - Unit and integration tests

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Ready to build something amazing?** 🚀

Start by exploring the codebase, adding your first table schema, and building your admin interface. The foundation is solid—now make it yours!