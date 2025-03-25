// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  destinations;
  packages;
  accommodations;
  bookings;
  travelTips;
  userId = 1;
  destinationId = 1;
  packageId = 1;
  accommodationId = 1;
  bookingId = 1;
  travelTipId = 1;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.destinations = /* @__PURE__ */ new Map();
    this.packages = /* @__PURE__ */ new Map();
    this.accommodations = /* @__PURE__ */ new Map();
    this.bookings = /* @__PURE__ */ new Map();
    this.travelTips = /* @__PURE__ */ new Map();
    this.seedData();
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = {
      ...insertUser,
      id,
      membershipLevel: "Standard",
      journeysCompleted: 0,
      destinationsVisited: 0,
      totalDaysInSpace: 0,
      loyaltyPoints: 0
    };
    this.users.set(id, user);
    return user;
  }
  // Destination operations
  async getAllDestinations() {
    return Array.from(this.destinations.values());
  }
  async getDestination(id) {
    return this.destinations.get(id);
  }
  async createDestination(destination) {
    const id = this.destinationId++;
    const newDestination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }
  // Package operations
  async getAllPackages() {
    return Array.from(this.packages.values());
  }
  async getPackage(id) {
    return this.packages.get(id);
  }
  async createPackage(pkg) {
    const id = this.packageId++;
    const newPackage = { ...pkg, id };
    this.packages.set(id, newPackage);
    return newPackage;
  }
  // Accommodation operations
  async getAllAccommodations() {
    return Array.from(this.accommodations.values());
  }
  async getAccommodation(id) {
    return this.accommodations.get(id);
  }
  async createAccommodation(accommodation) {
    const id = this.accommodationId++;
    const newAccommodation = { ...accommodation, id };
    this.accommodations.set(id, newAccommodation);
    return newAccommodation;
  }
  // Booking operations
  async getAllBookings() {
    return Array.from(this.bookings.values());
  }
  async getUserBookings(userId) {
    return Array.from(this.bookings.values()).filter((booking) => booking.userId === userId);
  }
  async getBooking(id) {
    return this.bookings.get(id);
  }
  async createBooking(booking) {
    const id = this.bookingId++;
    const confirmationCode = `DS-${Math.floor(1e4 + Math.random() * 9e4)}-LX`;
    const createdAt = /* @__PURE__ */ new Date();
    const newBooking = { ...booking, id, confirmationCode, createdAt };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  // Travel tips operations
  async getAllTravelTips() {
    return Array.from(this.travelTips.values());
  }
  async getTravelTip(id) {
    return this.travelTips.get(id);
  }
  async createTravelTip(tip) {
    const id = this.travelTipId++;
    const newTip = { ...tip, id };
    this.travelTips.set(id, newTip);
    return newTip;
  }
  // Seed initial data
  seedData() {
    const destinations2 = [
      {
        name: "Lunar Resort Alpha",
        location: "Moon",
        description: "Experience luxury in the first permanent lunar settlement with Earth views and low-gravity recreation.",
        imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        basePrice: 25e4
      },
      {
        name: "Mars Colony One",
        location: "Mars",
        description: "Visit the pioneering Mars habitat with guided tours of the red planet's most spectacular landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1545156521-77bd85671d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        basePrice: 45e4
      },
      {
        name: "Orbital Hotel Zenith",
        location: "Earth Orbit",
        description: "The premier luxury orbital hotel with 360\xB0 Earth views, zero-gravity spa, and gourmet dining.",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
        basePrice: 175e3
      }
    ];
    destinations2.forEach((dest) => this.createDestination(dest));
    const packages2 = [
      {
        name: "Economy Shuttle",
        price: 12e4,
        description: "Affordable space travel experience",
        features: [
          "Standard shuttle transport to orbit",
          "3 nights in basic orbital accommodation",
          "Standard space-food dining package",
          "1 guided space walk experience",
          "Digital photo package"
        ],
        isPopular: true,
        isPremium: false
      },
      {
        name: "Luxury Orbital Suite",
        price: 35e4,
        description: "Premium space travel experience",
        features: [
          "Private luxury spacecraft transport",
          "7 nights in premium orbital suite",
          "Gourmet dining with celebrity chef",
          "3 guided space walks with expert",
          "Zero-gravity spa and recreation",
          "Professional photography & film"
        ],
        isPopular: false,
        isPremium: true
      },
      {
        name: "VIP Explorer",
        price: 58e4,
        description: "Ultimate space travel experience",
        features: [
          "Ultra-luxury private spacecraft",
          "10 nights across multiple destinations",
          "Personalized menu with private chef",
          "Unlimited guided activities",
          "Lunar surface expedition included",
          "24/7 personal concierge service"
        ],
        isPopular: false,
        isPremium: false
      }
    ];
    packages2.forEach((pkg) => this.createPackage(pkg));
    const accommodations2 = [
      {
        name: "Lunar Dome Suite",
        location: "LUNAR SURFACE",
        description: "Luxurious transparent dome suites offering panoramic views of the lunar landscape and Earth.",
        imageUrl: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        pricePerNight: 65e3,
        capacity: "2-4 guests",
        amenities: ["Space-Fi", "Dining", "Earth-view windows"]
      },
      {
        name: "Orbital Luxury Pod",
        location: "EARTH ORBIT",
        description: "Premium orbital accommodations with rotating Earth views and zero-gravity sleeping chambers.",
        imageUrl: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        pricePerNight: 45e3,
        capacity: "1-2 guests",
        amenities: ["Space-Fi", "Mini Bar", "Zero-G sleeping"]
      },
      {
        name: "Mars Habitat Villa",
        location: "MARS COLONY",
        description: "Exclusive underground Martian villas with observation domes and private terraformed gardens.",
        imageUrl: "https://images.unsplash.com/photo-1518365050014-70fe7232897f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        pricePerNight: 85e3,
        capacity: "2-6 guests",
        amenities: ["Space-Fi", "Private", "Terraformed garden"]
      }
    ];
    accommodations2.forEach((acc) => this.createAccommodation(acc));
    const travelTips2 = [
      {
        title: "Preparation for Lunar Gravity",
        content: "For your upcoming lunar trip, I recommend daily leg strength exercises. Lunar gravity is 1/6 of Earth's, and strong legs will help you adapt to the unique gravitational environment.",
        category: "preparation"
      },
      {
        title: "Suggested Items for Lunar Resort",
        content: "While most necessities are provided, consider bringing: a favorite small memento (under 100g), prescription medications, and specialized skincare for the controlled lunar environment.",
        category: "packing"
      },
      {
        title: "Photography on the Moon",
        content: "The lunar resort provides specialized cameras, but if bringing your own, use settings for high contrast environments. The Earth-rise over Mare Imbrium is visible from your suite on days 2-3 of your stay.",
        category: "activities"
      }
    ];
    travelTips2.forEach((tip) => this.createTravelTip(tip));
    this.createUser({
      username: "demo",
      password: "password",
      fullName: "Space Explorer",
      email: "demo@example.com"
    }).then((user) => {
      const updatedUser = {
        ...user,
        membershipLevel: "Platinum",
        journeysCompleted: 3,
        destinationsVisited: 5,
        totalDaysInSpace: 22,
        loyaltyPoints: 248500
      };
      this.users.set(user.id, updatedUser);
      const futureDate = /* @__PURE__ */ new Date();
      futureDate.setDate(futureDate.getDate() + 25);
      const returnDate = new Date(futureDate);
      returnDate.setDate(returnDate.getDate() + 5);
      this.createBooking({
        userId: user.id,
        destinationId: 1,
        // Lunar Resort Alpha
        packageId: 2,
        // Luxury package
        accommodationId: 1,
        // Lunar Dome Suite
        departureDate: futureDate,
        returnDate,
        travelers: 2,
        totalPrice: 35e4,
        status: "confirmed"
      });
    });
  }
};
var storage = new MemStorage();

// server/routes.ts
import express from "express";
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  membershipLevel: text("membership_level").default("Standard"),
  journeysCompleted: integer("journeys_completed").default(0),
  destinationsVisited: integer("destinations_visited").default(0),
  totalDaysInSpace: integer("total_days_in_space").default(0),
  loyaltyPoints: integer("loyalty_points").default(0)
});
var destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  basePrice: integer("base_price").notNull()
});
var packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  isPopular: boolean("is_popular").default(false),
  isPremium: boolean("is_premium").default(false)
});
var accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  capacity: text("capacity").notNull(),
  amenities: text("amenities").array().notNull()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  destinationId: integer("destination_id").notNull(),
  packageId: integer("package_id").notNull(),
  accommodationId: integer("accommodation_id"),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  travelers: integer("travelers").notNull(),
  totalPrice: integer("total_price").notNull(),
  confirmationCode: text("confirmation_code").notNull(),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow()
});
var travelTips = pgTable("travel_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true
});
var insertDestinationSchema = createInsertSchema(destinations);
var insertPackageSchema = createInsertSchema(packages);
var insertAccommodationSchema = createInsertSchema(accommodations);
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  confirmationCode: true,
  createdAt: true
});
var insertTravelTipSchema = createInsertSchema(travelTips).omit({
  id: true
});

// server/routes.ts
async function registerRoutes(app2) {
  const apiRouter = express.Router();
  apiRouter.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  });
  apiRouter.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      handleError(error, res);
    }
  });
  apiRouter.post("/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      handleError(error, res);
    }
  });
  apiRouter.get("/destinations", asyncHandler(async (req, res) => {
    res.json(await storage.getAllDestinations());
  }));
  apiRouter.get("/destinations/:id", asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const destination = await storage.getDestination(id);
    if (!destination) throw new NotFoundError("Destination");
    res.json(destination);
  }));
  apiRouter.post("/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      handleError(error, res);
    }
  });
  apiRouter.get("/bookings", asyncHandler(async (req, res) => {
    const userId = req.query.userId ? parseId(req.query.userId) : void 0;
    const bookings2 = userId ? await storage.getUserBookings(userId) : await storage.getAllBookings();
    res.json(bookings2);
  }));
  app2.use("/api", apiRouter);
  return createServer(app2);
}
function parseId(id) {
  const parsed = parseInt(id);
  if (isNaN(parsed)) throw new ClientError("Invalid ID");
  return parsed;
}
function handleError(error, res) {
  if (error instanceof ClientError) {
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.errors });
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}
function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
var ClientError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
  }
};
var NotFoundError = class extends Error {
  constructor(entity) {
    super(`${entity} not found`);
    this.name = "NotFoundError";
  }
};

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname2, "client", "src"),
      "@shared": path.resolve(__dirname2, "shared")
    }
  },
  root: path.resolve(__dirname2, "client"),
  build: {
    outDir: path.resolve(__dirname2, "dist/public"),
    emptyOutDir: true,
    // Vercel optimization additions
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["lodash", "axios"]
        }
      }
    }
  },
  // Vercel-specific server configuration
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true
      }
    }
  },
  // Ensure public assets are properly referenced
  base: "/public/"
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname3 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import path3 from "path";
import http from "http";
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});
var isVercel = process.env.VERCEL === "1";
var isProduction = process.env.NODE_ENV === "production";
var configureServer = async () => {
  await registerRoutes(app);
  if (!isProduction && !isVercel) {
    const server = http.createServer(app);
    await setupVite(app, server);
    return server;
  } else {
    app.use(express3.static(path3.join(__dirname, "../dist/public")));
    app.get("*", (req, res) => {
      res.sendFile(path3.join(__dirname, "../dist/public/index.html"));
    });
    return http.createServer(app);
  }
};
if (!isVercel) {
  configureServer().then((server) => {
    const port = process.env.PORT || 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: false
    }, () => {
      log(`serving on port ${port}`);
    });
  });
}
var index_default = app;
export {
  index_default as default
};
