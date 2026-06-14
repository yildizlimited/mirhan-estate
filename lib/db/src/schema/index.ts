import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  phone: text("phone"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name"),
  phone: text("phone").notNull(),
  profileImage: text("profile_image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  neighborhood: text("neighborhood"),
  address: text("address"),
  propertyType: text("property_type").notNull(),
  listingType: text("listing_type").notNull(),
  squareMeters: integer("square_meters").notNull(),
  rooms: text("rooms").notNull(),
  bathrooms: integer("bathrooms").notNull().default(1),
  buildingAge: integer("building_age"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  furnished: boolean("furnished").default(false),
  insideComplex: boolean("inside_complex").default(false),
  mortgageEligible: boolean("mortgage_eligible").default(false),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  status: text("status").default("active"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  propertyId: integer("property_id").references(() => properties.id),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  featuredImage: text("featured_image"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  published: boolean("published").default(false),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  transactionType: text("transaction_type").notNull(),
  salePrice: integer("sale_price").notNull(),
  commissionAmount: integer("commission_amount").notNull().default(0),
  commissionRate: doublePrecision("commission_rate").default(0),
  status: text("status").notNull().default("pending"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  phone: text("phone"),
  email: text("email"),
  profileImage: text("profile_image"),
  description: text("description"),
  specialty: text("specialty").array(),
  experience: integer("experience"),
  languages: text("languages").array(),
  rating: text("rating"),
  reviewCount: integer("review_count"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertAgentSchema = createInsertSchema(agents).omit({ id: true, createdAt: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, views: true, createdAt: true });
export const insertPropertyImageSchema = createInsertSchema(propertyImages).omit({ id: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, read: true, createdAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, transactionDate: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, createdAt: true });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = z.infer<typeof insertPropertyImageSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type PropertyWithImages = Property & { images: PropertyImage[]; agent?: Agent & { user?: User } };
export type TransactionWithDetails = Transaction & { property?: Property; agent?: Agent & { user?: User } };
