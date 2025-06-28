import express, { Request, Response } from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import cors from "cors";
import { connectDatabase } from "./database";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";
import transactionRoutes from "./routes/transactions";
import exportRoutes from "./routes/export";
import { fileURLToPath } from "url";
import { basename } from "path";


export const createServer = async () => {
  const app = express();

  // Try to connect to MongoDB
  const isMongoConnected = await connectDatabase();

  // Store connection status for routes to use
  app.locals.isMongoConnected = isMongoConnected;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files
  app.use("/uploads", express.static(join(process.cwd(), "uploads")));

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/export", exportRoutes);
  app.get("/api/demo", handleDemo);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  // Serve static files in production
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const distPath = join(process.cwd(), "dist", "spa");
    const indexPath = join(distPath, "index.html");

    // Serve static files
    app.use(express.static(distPath));

    // SPA fallback - serve index.html for all other routes
    app.get("*", (req: Request, res: Response) => {
      if (existsSync(indexPath)) {
        const html = readFileSync(indexPath, "utf-8");
        res.send(html);
      } else {
        res.status(404).send("Page not found");
      }
    });
  }

  return app;
};
const currentFile = fileURLToPath(import.meta.url);

if (basename(currentFile) === basename(process.argv[1])) {
  createServer()
    .then((server) => {
      const port = process.env.PORT || 8082;
      server.listen(port, () => {
        console.log(`🚀 Express server running on port ${port}`);
        console.log(`
          🔧 API endpoints available at http://localhost:${port}/api
        `);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}
// if (import.meta.url === `file://${process.argv[1]}`) {
//   createServer()
//     .then((server) => {
//       const port = process.env.PORT || 8082;
//       server.listen(port, () => {
//         console.log(`🚀 Express server running on port ${port}`);
//         console.log(
//           `🔧 API endpoints available at http://localhost:${port}/api`,
//         );
//       });
//     })
//     .catch((error) => {
//       console.error("Failed to start server:", error);
//       process.exit(1);
//     });
// }
