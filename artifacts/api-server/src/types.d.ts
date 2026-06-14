declare module "express-session" {
  interface SessionData {
    userId?: number;
    userRole?: string;
  }
}

export {};
