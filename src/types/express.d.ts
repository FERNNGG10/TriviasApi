import type { User as PrismaUser } from "../generated/prisma";

declare module "express-serve-static-core" {
  interface Request {
    user?: PrismaUser;
  }
}

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}
