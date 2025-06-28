import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { LoginRequest, RegisterRequest, AuthResponse } from "@shared/types";
import {
  generateToken,
  authenticateToken,
  AuthRequest,
} from "../middleware/auth";
// Removed mock data imports - using MongoDB only
import bcrypt from "bcryptjs";

const router = Router();

// Register new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Check if MongoDB is connected
    if (!req.app.locals.isMongoConnected) {
      res.status(503).json({
        error:
          "Database not available. Please contact administrator to set up MongoDB connection.",
      });
      return;
    }

    // Validate input
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      return;
    }

    // Use MongoDB only - no mock data
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = generateToken(user._id.toString());
    const response: AuthResponse = {
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;
    console.log("Login attempt:", { email, passwordLength: password?.length });

    // Check if MongoDB is connected
    if (!req.app.locals.isMongoConnected) {
      res.status(503).json({
        error:
          "Database not available. Please contact administrator to set up MongoDB connection.",
      });
      return;
    }

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Use MongoDB only - no mock data
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id.toString());
    const response: AuthResponse = {
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      if (req.app.locals.isMongoConnected) {
        // Return full user data from MongoDB
        res.json({
          _id: req.user._id.toString(),
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          profilePhoto: req.user.profilePhoto,
          createdAt: req.user.createdAt,
        });
      } else {
        // Return basic user data when MongoDB not available
        res.json({
          _id: req.user._id.toString(),
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          profilePhoto: null,
          createdAt: req.user.createdAt,
          _dbUnavailable: true,
        });
      }
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Logout (client-side token removal, but we can track this server-side if needed)
router.post(
  "/logout",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({ message: "Logged out successfully" });
  },
);

export default router;
