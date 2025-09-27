import { Request, Response, NextFunction } from "express";

export const jsonErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      message: "Invalid JSON format",
      error: "Request body contains invalid JSON",
    });
  }
  next(error);
};

export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({
        message: "Invalid Content-Type",
        error: "Content-Type must be application/json",
      });
    }
  }
  next();
};
