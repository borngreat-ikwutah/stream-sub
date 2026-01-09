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
import { users } from "./users";
import { creators } from "./creators";

export const tips = pgTable(
  "tips",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    fromUserId: uuid("from_user_id")
      .notNull()
      .references(() => users.id),

    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creators.id),

    amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
    tokenAddress: text("token_address").notNull(),

    txHash: text("tx_hash").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    creatorIdx: index("idx_tips_creator").on(table.creatorId),
  }),
);

export type Tip = typeof tips.$inferSelect;
