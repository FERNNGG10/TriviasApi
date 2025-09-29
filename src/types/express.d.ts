import { User } from "src/generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
