import { db } from "@workspace/db";
import { eq, and, desc, ilike, gte, lte, sql, inArray } from "drizzle-orm";
import {
  users, agents, properties, propertyImages, favorites, messages, blogPosts, teamMembers, transactions,
  type User, type InsertUser,
  type Agent, type InsertAgent,
  type Property, type InsertProperty,
  type PropertyImage, type InsertPropertyImage,
  type Favorite, type InsertFavorite,
  type Message, type InsertMessage,
  type BlogPost, type InsertBlogPost,
  type Transaction, type InsertTransaction, type TransactionWithDetails,
  type TeamMember, type InsertTeamMember,
  type PropertyWithImages,
} from "@workspace/db";

export type PropertyFilters = {
  city?: string;
  district?: string;
  listingType?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  rooms?: string;
  furnished?: boolean;
  insideComplex?: boolean;
  mortgageEligible?: boolean;
  search?: string;
  approved?: boolean;
};

class DatabaseStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async getAgentByUserId(userId: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.userId, userId));
    return agent;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [created] = await db.insert(agents).values(agent).returning();
    return created;
  }

  async updateAgent(id: number, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const [updated] = await db.update(agents).set(data).where(eq(agents.id, id)).returning();
    return updated;
  }

  async getAllAgents(): Promise<(Agent & { user?: User })[]> {
    const allAgents = await db.select().from(agents).orderBy(desc(agents.createdAt));
    const result = [];
    for (const agent of allAgents) {
      const user = await this.getUser(agent.userId);
      result.push({ ...agent, user: user ? { ...user, password: "" } : undefined });
    }
    return result;
  }

  private async attachImages(props: Property[]): Promise<PropertyWithImages[]> {
    if (props.length === 0) return [];
    const propIds = props.map(p => p.id);
    const images = await db.select().from(propertyImages).where(inArray(propertyImages.propertyId, propIds));
    const agentIds = [...new Set(props.map(p => p.agentId))];
    const agentRows = await db.select().from(agents).where(inArray(agents.id, agentIds));
    const userIds = agentRows.map(a => a.userId);
    const userRows = userIds.length > 0 ? await db.select().from(users).where(inArray(users.id, userIds)) : [];

    return props.map(p => {
      const agent = agentRows.find(a => a.id === p.agentId);
      const rawUser = agent ? userRows.find(u => u.id === agent.userId) : undefined;
      const user = rawUser ? { ...rawUser, password: "" } : undefined;
      return {
        ...p,
        images: images.filter(img => img.propertyId === p.id),
        agent: agent ? { ...agent, user } : undefined,
      };
    });
  }

  async getProperty(id: number): Promise<PropertyWithImages | undefined> {
    const [prop] = await db.select().from(properties).where(eq(properties.id, id));
    if (!prop) return undefined;
    const [result] = await this.attachImages([prop]);
    return result;
  }

  async getProperties(filters?: PropertyFilters): Promise<PropertyWithImages[]> {
    const conditions = [];
    if (filters?.approved !== undefined) conditions.push(eq(properties.approved, filters.approved));
    if (filters?.city) conditions.push(ilike(properties.city, filters.city));
    if (filters?.district) conditions.push(ilike(properties.district, filters.district));
    if (filters?.listingType) conditions.push(eq(properties.listingType, filters.listingType));
    if (filters?.propertyType) conditions.push(eq(properties.propertyType, filters.propertyType));
    if (filters?.minPrice) conditions.push(gte(properties.price, filters.minPrice));
    if (filters?.maxPrice) conditions.push(lte(properties.price, filters.maxPrice));
    if (filters?.minSquareMeters) conditions.push(gte(properties.squareMeters, filters.minSquareMeters));
    if (filters?.maxSquareMeters) conditions.push(lte(properties.squareMeters, filters.maxSquareMeters));
    if (filters?.rooms) conditions.push(eq(properties.rooms, filters.rooms));
    if (filters?.furnished !== undefined) conditions.push(eq(properties.furnished, filters.furnished));
    if (filters?.insideComplex !== undefined) conditions.push(eq(properties.insideComplex, filters.insideComplex));
    if (filters?.mortgageEligible !== undefined) conditions.push(eq(properties.mortgageEligible, filters.mortgageEligible));
    if (filters?.search) conditions.push(ilike(properties.title, `%${filters.search}%`));

    const query = conditions.length > 0
      ? db.select().from(properties).where(and(...conditions)).orderBy(desc(properties.createdAt))
      : db.select().from(properties).orderBy(desc(properties.createdAt));

    const props = await query;
    return this.attachImages(props);
  }

  async getFeaturedProperties(): Promise<PropertyWithImages[]> {
    const props = await db.select().from(properties)
      .where(and(eq(properties.featured, true), eq(properties.approved, true)))
      .orderBy(desc(properties.createdAt)).limit(6);
    return this.attachImages(props);
  }

  async getLatestProperties(limit = 8): Promise<PropertyWithImages[]> {
    const props = await db.select().from(properties)
      .where(eq(properties.approved, true))
      .orderBy(desc(properties.createdAt)).limit(limit);
    return this.attachImages(props);
  }

  async getPropertiesByAgent(agentId: number): Promise<PropertyWithImages[]> {
    const props = await db.select().from(properties)
      .where(eq(properties.agentId, agentId))
      .orderBy(desc(properties.createdAt));
    return this.attachImages(props);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property).returning();
    return created;
  }

  async updateProperty(id: number, data: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updated] = await db.update(properties).set(data).where(eq(properties.id, id)).returning();
    return updated;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(propertyImages).where(eq(propertyImages.propertyId, id));
    await db.delete(favorites).where(eq(favorites.propertyId, id));
    await db.delete(properties).where(eq(properties.id, id));
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await db.update(properties).set({ views: sql`${properties.views} + 1` }).where(eq(properties.id, id));
  }

  async addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const [created] = await db.insert(propertyImages).values(image).returning();
    return created;
  }

  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    return db.select().from(propertyImages).where(eq(propertyImages.propertyId, propertyId));
  }

  async deletePropertyImage(id: number): Promise<void> {
    await db.delete(propertyImages).where(eq(propertyImages.id, id));
  }

  async getFavorites(userId: number): Promise<PropertyWithImages[]> {
    const favs = await db.select().from(favorites).where(eq(favorites.userId, userId));
    if (favs.length === 0) return [];
    const propIds = favs.map(f => f.propertyId);
    const props = await db.select().from(properties).where(inArray(properties.id, propIds));
    return this.attachImages(props);
  }

  async addFavorite(fav: InsertFavorite): Promise<Favorite> {
    const [created] = await db.insert(favorites).values(fav).returning();
    return created;
  }

  async removeFavorite(userId: number, propertyId: number): Promise<void> {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
  }

  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    const [fav] = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
    return !!fav;
  }

  async getMessages(userId: number): Promise<(Message & { sender?: User; receiver?: User })[]> {
    const msgs = await db.select().from(messages)
      .where(sql`${messages.senderId} = ${userId} OR ${messages.receiverId} = ${userId}`)
      .orderBy(desc(messages.createdAt));
    const userIds = [...new Set(msgs.flatMap(m => [m.senderId, m.receiverId]))];
    const allUsers = userIds.length > 0 ? await db.select().from(users).where(inArray(users.id, userIds)) : [];
    return msgs.map(m => {
      const sender = allUsers.find(u => u.id === m.senderId);
      const receiver = allUsers.find(u => u.id === m.receiverId);
      return {
        ...m,
        sender: sender ? { ...sender, password: "" } : undefined,
        receiver: receiver ? { ...receiver, password: "" } : undefined,
      };
    });
  }

  async getConversation(user1Id: number, user2Id: number, propertyId?: number): Promise<Message[]> {
    const conditions = [
      sql`(${messages.senderId} = ${user1Id} AND ${messages.receiverId} = ${user2Id}) OR (${messages.senderId} = ${user2Id} AND ${messages.receiverId} = ${user1Id})`,
    ];
    if (propertyId) conditions.push(eq(messages.propertyId, propertyId));
    return db.select().from(messages).where(and(...conditions)).orderBy(messages.createdAt);
  }

  async sendMessage(msg: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(msg).returning();
    return created;
  }

  async markMessageRead(id: number): Promise<void> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }

  async getUnreadCount(userId: number): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.read, false)));
    return Number(result?.count || 0);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(data).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  private async attachTransactionDetails(txns: Transaction[]): Promise<TransactionWithDetails[]> {
    if (txns.length === 0) return [];
    const propIds = [...new Set(txns.map(t => t.propertyId))];
    const agentIds = [...new Set(txns.map(t => t.agentId))];
    const props = await db.select().from(properties).where(inArray(properties.id, propIds));
    const agentRows = await db.select().from(agents).where(inArray(agents.id, agentIds));
    const userIds = agentRows.map(a => a.userId);
    const userRows = userIds.length > 0 ? await db.select().from(users).where(inArray(users.id, userIds)) : [];
    return txns.map(t => {
      const prop = props.find(p => p.id === t.propertyId);
      const agent = agentRows.find(a => a.id === t.agentId);
      const user = agent ? userRows.find(u => u.id === agent.userId) : undefined;
      return {
        ...t,
        property: prop,
        agent: agent ? { ...agent, user: user ? { ...user, password: "" } : undefined } : undefined,
      };
    });
  }

  async createTransaction(txn: InsertTransaction): Promise<Transaction> {
    const [created] = await db.insert(transactions).values(txn).returning();
    return created;
  }

  async createTransactionWithStatus(txn: InsertTransaction, propertyId: number, newStatus: string): Promise<Transaction> {
    const [created] = await db.insert(transactions).values(txn).returning();
    await db.update(properties).set({ status: newStatus }).where(eq(properties.id, propertyId));
    return created;
  }

  async hasTransactions(propertyId: number): Promise<boolean> {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(transactions).where(eq(transactions.propertyId, propertyId));
    return (row?.count || 0) > 0;
  }

  async getTransactionsByAgent(agentId: number): Promise<TransactionWithDetails[]> {
    const txns = await db.select().from(transactions)
      .where(eq(transactions.agentId, agentId))
      .orderBy(desc(transactions.transactionDate));
    return this.attachTransactionDetails(txns);
  }

  async getAllTransactions(): Promise<TransactionWithDetails[]> {
    const txns = await db.select().from(transactions)
      .orderBy(desc(transactions.transactionDate));
    return this.attachTransactionDetails(txns);
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions).set({ status }).where(eq(transactions.id, id)).returning();
    return updated;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [txn] = await db.select().from(transactions).where(eq(transactions.id, id));
    return txn;
  }

  async getTeamMembers(activeOnly = false): Promise<TeamMember[]> {
    if (activeOnly) {
      return db.select().from(teamMembers).where(eq(teamMembers.active, true)).orderBy(teamMembers.sortOrder);
    }
    return db.select().from(teamMembers).orderBy(teamMembers.sortOrder);
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(member).returning();
    return created;
  }

  async updateTeamMember(id: number, data: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [updated] = await db.update(teamMembers).set(data).where(eq(teamMembers.id, id)).returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }
}

export const storage = new DatabaseStorage();
