import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
// Removed mock data imports - using MongoDB only

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (req.app.locals.isMongoConnected) {
      // Use MongoDB when available
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      req.user = user;
    } else {
      // MongoDB not available - create basic user object from token
      console.warn("MongoDB not available, using token-based auth");
      req.user = {
        _id: decoded.userId,
        email: "database@unavailable.com",
        name: "Database User",
        role: "analyst",
        createdAt: new Date(),
      } as any;
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
