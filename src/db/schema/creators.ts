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

export const creators = pgTable(
  "creators",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    displayName: text("display_name"),
    bio: text("bio"),
    profileImageUrl: text("profile_image_url"),

    isVerified: boolean("is_verified").notNull().default(false),
    verificationTxHash: text("verification_tx_hash"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_creators_user").on(table.userId),
  }),
);

export const creatorLinks = pgTable("creator_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.id, { onDelete: "cascade" }),

  platform: text("platform").notNull(),
  url: text("url").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Creator = typeof creators.$inferSelect;
export type NewCreator = typeof creators.$inferInsert;
export type CreatorLink = typeof creatorLinks.$inferSelect;
