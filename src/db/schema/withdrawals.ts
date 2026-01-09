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
import { creators } from "./creators";

export const withdrawals = pgTable(
  "withdrawals",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creators.id),

    amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
    tokenAddress: text("token_address").notNull(),

    txHash: text("tx_hash").notNull().unique(),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
  },
  (table) => ({
    creatorIdx: index("idx_withdrawals_creator").on(table.creatorId),
  }),
);
