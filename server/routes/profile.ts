import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { User } from "../models/User";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload profile photo
router.post(
  "/upload-photo",
  authenticateToken,
  upload.single("profilePhoto"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Save the file path to the user's profile
      const photoPath = `/uploads/${req.file.filename}`;

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profilePhoto: photoPath },
        { new: true },
      ).select("-password");

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        message: "Profile photo uploaded successfully",
        user: {
          _id: updatedUser._id.toString(),
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          profilePhoto: updatedUser.profilePhoto,
          createdAt: updatedUser.createdAt,
        },
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);
      res.status(500).json({ error: "Failed to upload profile photo" });
    }
  },
);

// Get user profile
router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get user profile" });
    }
  },
);

export default router;
