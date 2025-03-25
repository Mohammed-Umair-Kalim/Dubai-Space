import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  membershipLevel: text("membership_level").default("Standard"),
  journeysCompleted: integer("journeys_completed").default(0),
  destinationsVisited: integer("destinations_visited").default(0),
  totalDaysInSpace: integer("total_days_in_space").default(0),
  loyaltyPoints: integer("loyalty_points").default(0),
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  basePrice: integer("base_price").notNull(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  isPopular: boolean("is_popular").default(false),
  isPremium: boolean("is_premium").default(false),
});

export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  capacity: text("capacity").notNull(),
  amenities: text("amenities").array().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  destinationId: integer("destination_id").notNull(),
  packageId: integer("package_id").notNull(),
  accommodationId: integer("accommodation_id"),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  travelers: integer("travelers").notNull(),
  totalPrice: integer("total_price").notNull(),
  confirmationCode: text("confirmation_code").notNull(),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const travelTips = pgTable("travel_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

export const insertDestinationSchema = createInsertSchema(destinations);
export const insertPackageSchema = createInsertSchema(packages);
export const insertAccommodationSchema = createInsertSchema(accommodations);

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  confirmationCode: true,
  createdAt: true,
});

export const insertTravelTipSchema = createInsertSchema(travelTips).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertTravelTip = z.infer<typeof insertTravelTipSchema>;
export type TravelTip = typeof travelTips.$inferSelect;
