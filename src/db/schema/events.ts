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

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),

  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
