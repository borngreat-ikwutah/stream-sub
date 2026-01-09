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

export const zkCredentials = pgTable("zk_credentials", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()

    .references(() => users.id, { onDelete: "cascade" }),

  nullifierHash: text("nullifier_hash").notNull().unique(),
  issuer: text("issuer").notNull(),

  isRevoked: boolean("is_revoked").notNull().default(false),
  verifiedAt: timestamp("verified_at").notNull().defaultNow(),
});

export type ZkCredential = typeof zkCredentials.$inferSelect;
