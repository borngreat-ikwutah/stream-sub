import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  numeric,
  bigint,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    walletAddress: text("wallet_address").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    walletIdx: index("idx_users_wallet").on(table.walletAddress),
  }),
);

// Export table types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
