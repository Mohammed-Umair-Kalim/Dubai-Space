import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { z } from "zod";
import { insertBookingSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Enhanced error handling middleware for API routes
  apiRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // User routes
  apiRouter.post('/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      handleError(error, res);
    }
  });

  apiRouter.post('/login', async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Omit sensitive data from response
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Data routes (destinations, packages, accommodations, travel-tips)
  apiRouter.get('/destinations', asyncHandler(async (req, res) => {
    res.json(await storage.getAllDestinations());
  }));

  apiRouter.get('/destinations/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    const destination = await storage.getDestination(id);
    if (!destination) throw new NotFoundError('Destination');
    res.json(destination);
  }));

  // ... similar pattern for packages, accommodations, travel-tips ...

  // Booking routes
  apiRouter.post('/bookings', async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      handleError(error, res);
    }
  });

  apiRouter.get('/bookings', asyncHandler(async (req, res) => {
    const userId = req.query.userId ? parseId(req.query.userId as string) : undefined;
    const bookings = userId 
      ? await storage.getUserBookings(userId) 
      : await storage.getAllBookings();
    res.json(bookings);
  }));

  // Mount API routes
  app.use('/api', apiRouter);

  return createServer(app);
}

// Helper functions for Vercel optimization
function parseId(id: string): number {
  const parsed = parseInt(id);
  if (isNaN(parsed)) throw new ClientError('Invalid ID');
  return parsed;
}

function handleError(error: unknown, res: express.Response) {
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
  res.status(500).json({ error: 'Internal server error' });
}

function asyncHandler(handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientError';
  }
}

class NotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity} not found`);
    this.name = 'NotFoundError';
  }
}