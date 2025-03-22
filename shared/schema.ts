import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
});

export const testCategories = pgTable("test_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("science"),
});

export const insertTestCategorySchema = createInsertSchema(testCategories).pick({
  name: true,
  description: true,
  icon: true,
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  categoryId: integer("category_id").notNull(),
  preparationInstructions: text("preparation_instructions"),
  reportTemplate: json("report_template"),
});

export const insertTestSchema = createInsertSchema(tests).pick({
  name: true,
  description: true,
  price: true,
  categoryId: true,
  preparationInstructions: true,
  reportTemplate: true,
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull(),
  userId: integer("user_id").notNull(),
  bookingId: text("booking_id").notNull().unique(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  collectionType: text("collection_type").notNull(),
  status: text("status").notNull().default("booked"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  testId: true,
  userId: true,
  scheduledDate: true,
  collectionType: true,
  address: true,
});

export const bookingStatuses = pgTable("booking_statuses", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  notes: text("notes"),
});

export const insertBookingStatusSchema = createInsertSchema(bookingStatuses).pick({
  bookingId: true,
  status: true,
  notes: true,
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  reportId: text("report_id").notNull().unique(),
  results: json("results"),
  insights: json("insights"),
  generatedDate: timestamp("generated_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  bookingId: true,
  results: true,
  insights: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TestCategory = typeof testCategories.$inferSelect;
export type InsertTestCategory = z.infer<typeof insertTestCategorySchema>;

export type Test = typeof tests.$inferSelect;
export type InsertTest = z.infer<typeof insertTestSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type BookingStatus = typeof bookingStatuses.$inferSelect;
export type InsertBookingStatus = z.infer<typeof insertBookingStatusSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// Status constants
export const TEST_STATUSES = {
  BOOKED: "booked",
  SAMPLE_COLLECTED: "sample_collected",
  PROCESSING: "processing",
  ANALYZING: "analyzing",
  COMPLETED: "completed",
};

// Collection type constants
export const COLLECTION_TYPES = {
  HOME: "home",
  LAB: "lab",
};
