import { integer, pgTable, varchar, date, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});


export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectName:  varchar({ length: 255 }).notNull(),
  projectDescription : varchar({ length: 255 }).notNull(),
  userId: integer().references(() => usersTable.id),
});


export const tasksTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  dueDate: date("due_date"),
  priority: varchar({ length: 255 }).notNull(),
  projectName: varchar({ length: 255 }),
  userId: integer().references(() => usersTable.id),
  completed: boolean().notNull().default(false),
});