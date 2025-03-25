import { 
  users, packages, destinations, accommodations, bookings, travelTips,
  type User, type InsertUser, 
  type Package, type InsertPackage,
  type Destination, type InsertDestination,
  type Accommodation, type InsertAccommodation,
  type Booking, type InsertBooking,
  type TravelTip, type InsertTravelTip
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destination operations
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Package operations
  getAllPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  
  // Accommodation operations
  getAllAccommodations(): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  
  // Booking operations
  getAllBookings(): Promise<Booking[]>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Travel tips operations
  getAllTravelTips(): Promise<TravelTip[]>;
  getTravelTip(id: number): Promise<TravelTip | undefined>;
  createTravelTip(tip: InsertTravelTip): Promise<TravelTip>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private packages: Map<number, Package>;
  private accommodations: Map<number, Accommodation>;
  private bookings: Map<number, Booking>;
  private travelTips: Map<number, TravelTip>;
  
  private userId = 1;
  private destinationId = 1;
  private packageId = 1;
  private accommodationId = 1;
  private bookingId = 1;
  private travelTipId = 1;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.packages = new Map();
    this.accommodations = new Map();
    this.bookings = new Map();
    this.travelTips = new Map();
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, 
      membershipLevel: 'Standard',
      journeysCompleted: 0,
      destinationsVisited: 0,
      totalDaysInSpace: 0,
      loyaltyPoints: 0
    };
    this.users.set(id, user);
    return user;
  }

  // Destination operations
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationId++;
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = this.packageId++;
    const newPackage: Package = { ...pkg, id };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  // Accommodation operations
  async getAllAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.accommodationId++;
    const newAccommodation: Accommodation = { ...accommodation, id };
    this.accommodations.set(id, newAccommodation);
    return newAccommodation;
  }

  // Booking operations
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const confirmationCode = `DS-${Math.floor(10000 + Math.random() * 90000)}-LX`;
    const createdAt = new Date();
    const newBooking: Booking = { ...booking, id, confirmationCode, createdAt };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  // Travel tips operations
  async getAllTravelTips(): Promise<TravelTip[]> {
    return Array.from(this.travelTips.values());
  }

  async getTravelTip(id: number): Promise<TravelTip | undefined> {
    return this.travelTips.get(id);
  }

  async createTravelTip(tip: InsertTravelTip): Promise<TravelTip> {
    const id = this.travelTipId++;
    const newTip: TravelTip = { ...tip, id };
    this.travelTips.set(id, newTip);
    return newTip;
  }

  // Seed initial data
  private seedData() {
    // Seed destinations
    const destinations: InsertDestination[] = [
      {
        name: "Lunar Resort Alpha",
        location: "Moon",
        description: "Experience luxury in the first permanent lunar settlement with Earth views and low-gravity recreation.",
        imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        basePrice: 250000,
      },
      {
        name: "Mars Colony One",
        location: "Mars",
        description: "Visit the pioneering Mars habitat with guided tours of the red planet's most spectacular landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1545156521-77bd85671d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        basePrice: 450000,
      },
      {
        name: "Orbital Hotel Zenith",
        location: "Earth Orbit",
        description: "The premier luxury orbital hotel with 360° Earth views, zero-gravity spa, and gourmet dining.",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
        basePrice: 175000,
      }
    ];

    destinations.forEach(dest => this.createDestination(dest));

    // Seed packages
    const packages: InsertPackage[] = [
      {
        name: "Economy Shuttle",
        price: 120000,
        description: "Affordable space travel experience",
        features: [
          "Standard shuttle transport to orbit",
          "3 nights in basic orbital accommodation",
          "Standard space-food dining package",
          "1 guided space walk experience",
          "Digital photo package"
        ],
        isPopular: true,
        isPremium: false,
      },
      {
        name: "Luxury Orbital Suite",
        price: 350000,
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
        isPremium: true,
      },
      {
        name: "VIP Explorer",
        price: 580000,
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
        isPremium: false,
      }
    ];

    packages.forEach(pkg => this.createPackage(pkg));

    // Seed accommodations
    const accommodations: InsertAccommodation[] = [
      {
        name: "Lunar Dome Suite",
        location: "LUNAR SURFACE",
        description: "Luxurious transparent dome suites offering panoramic views of the lunar landscape and Earth.",
        imageUrl: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        pricePerNight: 65000,
        capacity: "2-4 guests",
        amenities: ["Space-Fi", "Dining", "Earth-view windows"]
      },
      {
        name: "Orbital Luxury Pod",
        location: "EARTH ORBIT",
        description: "Premium orbital accommodations with rotating Earth views and zero-gravity sleeping chambers.",
        imageUrl: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        pricePerNight: 45000,
        capacity: "1-2 guests",
        amenities: ["Space-Fi", "Mini Bar", "Zero-G sleeping"]
      },
      {
        name: "Mars Habitat Villa",
        location: "MARS COLONY",
        description: "Exclusive underground Martian villas with observation domes and private terraformed gardens.",
        imageUrl: "https://images.unsplash.com/photo-1518365050014-70fe7232897f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        pricePerNight: 85000,
        capacity: "2-6 guests",
        amenities: ["Space-Fi", "Private", "Terraformed garden"]
      }
    ];

    accommodations.forEach(acc => this.createAccommodation(acc));

    // Seed travel tips
    const travelTips: InsertTravelTip[] = [
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

    travelTips.forEach(tip => this.createTravelTip(tip));

    // Create a demo user
    this.createUser({
      username: "demo",
      password: "password",
      fullName: "Space Explorer",
      email: "demo@example.com"
    }).then(user => {
      // Update user stats
      const updatedUser = {
        ...user,
        membershipLevel: "Platinum",
        journeysCompleted: 3,
        destinationsVisited: 5,
        totalDaysInSpace: 22,
        loyaltyPoints: 248500
      };
      this.users.set(user.id, updatedUser);

      // Create a sample booking for the demo user
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 25);
      
      const returnDate = new Date(futureDate);
      returnDate.setDate(returnDate.getDate() + 5);
      
      this.createBooking({
        userId: user.id,
        destinationId: 1, // Lunar Resort Alpha
        packageId: 2, // Luxury package
        accommodationId: 1, // Lunar Dome Suite
        departureDate: futureDate,
        returnDate: returnDate,
        travelers: 2,
        totalPrice: 350000,
        status: "confirmed"
      });
    });
  }
}

export const storage = new MemStorage();
