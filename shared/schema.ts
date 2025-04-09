import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Task table schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority", { enum: ["low", "normal", "high"] }).notNull().default("normal"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  priority: true,
});

export const updateTaskSchema = z.object({
  completed: z.boolean(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
