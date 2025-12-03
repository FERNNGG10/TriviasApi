import { Request, Response, NextFunction } from "express";
import { RoleName } from "../generated/prisma";

export const requireRole = (allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!user.role || !user.role.name) {
      return res.status(403).json({
        message: "User role not found",
      });
    }

    if (!allowedRoles.includes(user.role.name)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

export const requireAdmin = requireRole([RoleName.admin]);

export const requirePlayer = requireRole([RoleName.player]);

export const requireAuth = requireRole([RoleName.admin, RoleName.player]);
