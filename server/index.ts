import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from 'path';
import http from 'http';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

// Vercel-specific setup
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';

const configureServer = async () => {
  // Register routes first
  await registerRoutes(app);

  // Vite setup - only in development
  if (!isProduction && !isVercel) {
    const server = http.createServer(app);
    await setupVite(app, server);
    return server;
  } else {
    // In production (including Vercel), serve static files
    app.use(express.static(path.join(__dirname, '../dist/public')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/public/index.html'));
    });
    return http.createServer(app);
  }
};

// Only start the server if not running on Vercel
if (!isVercel) {
  configureServer().then(server => {
    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: false,
    }, () => {
      log(`serving on port ${port}`);
    });
  });
}

// Export for Vercel serverless
export default app;