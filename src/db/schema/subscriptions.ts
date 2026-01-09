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

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    subscriberUserId: uuid("subscriber_user_id")
      .notNull()
      .references(() => users.id),

    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creators.id),

    amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
    tokenAddress: text("token_address").notNull(),

    intervalSeconds: bigint("interval_seconds", { mode: "number" }).notNull(),
    nextPaymentAt: timestamp("next_payment_at").notNull(),

    isActive: boolean("is_active").notNull().default(true),
    onchainSubscriptionId: text("onchain_subscription_id").notNull().unique(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    creatorIdx: index("idx_subscriptions_creator").on(table.creatorId),
  }),
);

export const subscriptionPayments = pgTable("subscription_payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => subscriptions.id, { onDelete: "cascade" }),

  txHash: text("tx_hash").notNull().unique(),
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),

  executedAt: timestamp("executed_at").notNull(),
  executorAddress: text("executor_address"),

  status: text("status", {
    enum: ["success", "failed"],
  }).notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type SubscriptionPayment = typeof subscriptionPayments.$inferSelect;
export type NewSubscriptionPayment = typeof subscriptionPayments.$inferInsert;
