import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  insertUserSchema, 
  insertVehicleSchema, 
  insertGpsLocationSchema,
  insertMaintenanceSchema,
  insertActivityLogSchema,
  insertFuelReportSchema,
  insertGeofenceSchema,
  insertAlertSchema
} from "@shared/schema";
import { z } from "zod";

// Session configuration
const MemoryStore = createMemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || "riderlink-fleet-management-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Authentication middleware
  const authenticate = (req: Request, res: Response, next: Function) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Role-based access middleware
  const authorize = (roles: string[]) => (req: Request, res: Response, next: Function) => {
    if (!req.session.userRole || !roles.includes(req.session.userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) { // In production, use proper password hashing
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user info in session
      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        req.session.destroy(() => {});
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes
  app.get("/api/users", authenticate, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const users = await storage.listUsers();
      res.json(users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        active: user.active
      })));
    } catch (error) {
      console.error("List users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users", authenticate, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        active: user.active
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Create user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Vehicle routes
  app.get("/api/vehicles", authenticate, async (req, res) => {
    try {
      let vehicles = await storage.listVehicles();
      
      // Filter by status if provided
      const status = req.query.status as string;
      if (status) {
        vehicles = vehicles.filter(v => v.status === status);
      }
      
      res.json(vehicles);
    } catch (error) {
      console.error("List vehicles error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/vehicles/:id", authenticate, async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(Number(req.params.id));
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error("Get vehicle error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/vehicles", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      
      // Create activity log
      await storage.createActivityLog({
        userId: req.session.userId,
        vehicleId: vehicle.id,
        action: "vehicle_created",
        description: `Vehicle ${vehicle.vehicleId} was created`
      });
      
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
      }
      console.error("Create vehicle error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/vehicles/:id", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const vehicleId = Number(req.params.id);
      const vehicleData = req.body;
      
      const vehicle = await storage.updateVehicle(vehicleId, vehicleData);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId: req.session.userId,
        vehicleId: vehicle.id,
        action: "vehicle_updated",
        description: `Vehicle ${vehicle.vehicleId} was updated`
      });
      
      res.json(vehicle);
    } catch (error) {
      console.error("Update vehicle error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/vehicles/:id/assign", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const vehicleId = Number(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const vehicle = await storage.assignVehicleToUser(vehicleId, Number(userId));
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error("Assign vehicle error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // GPS Location routes
  app.post("/api/gps-locations", authenticate, async (req, res) => {
    try {
      const locationData = insertGpsLocationSchema.parse(req.body);
      const location = await storage.createGpsLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      console.error("Create GPS location error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/vehicles/:id/gps-locations", authenticate, async (req, res) => {
    try {
      const vehicleId = Number(req.params.id);
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      
      const locations = await storage.listGpsLocationsForVehicle(vehicleId, limit);
      res.json(locations);
    } catch (error) {
      console.error("List GPS locations error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/vehicles/:id/latest-location", authenticate, async (req, res) => {
    try {
      const vehicleId = Number(req.params.id);
      const location = await storage.getLatestGpsLocation(vehicleId);
      
      if (!location) {
        return res.status(404).json({ message: "No GPS data found for this vehicle" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Get latest GPS location error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Maintenance routes
  app.get("/api/maintenance", authenticate, async (req, res) => {
    try {
      const vehicleId = req.query.vehicleId ? Number(req.query.vehicleId) : undefined;
      let maintenanceRecords;
      
      if (vehicleId) {
        maintenanceRecords = await storage.listMaintenanceForVehicle(vehicleId);
      } else {
        // Get upcoming maintenance for all vehicles
        maintenanceRecords = await storage.listUpcomingMaintenance();
      }
      
      res.json(maintenanceRecords);
    } catch (error) {
      console.error("List maintenance error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/maintenance", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const maintenanceData = insertMaintenanceSchema.parse({
        ...req.body,
        createdBy: req.session.userId
      });
      
      const maintenance = await storage.createMaintenance(maintenanceData);
      
      // Create activity log
      await storage.createActivityLog({
        userId: req.session.userId,
        vehicleId: maintenance.vehicleId,
        action: "maintenance_scheduled",
        description: `Maintenance scheduled for vehicle ID ${maintenance.vehicleId}`
      });
      
      res.status(201).json(maintenance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance data", errors: error.errors });
      }
      console.error("Create maintenance error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/maintenance/:id/complete", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const maintenanceId = Number(req.params.id);
      const { completedDate, notes } = req.body;
      
      const maintenance = await storage.updateMaintenance(maintenanceId, {
        completedDate: completedDate || new Date(),
        notes
      });
      
      if (!maintenance) {
        return res.status(404).json({ message: "Maintenance record not found" });
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId: req.session.userId,
        vehicleId: maintenance.vehicleId,
        action: "maintenance_completed",
        description: `Maintenance completed for vehicle ID ${maintenance.vehicleId}`
      });
      
      // Update vehicle's last maintenance date
      const vehicle = await storage.getVehicle(maintenance.vehicleId);
      if (vehicle) {
        await storage.updateVehicle(vehicle.id, {
          lastMaintenanceDate: maintenance.completedDate,
          status: "available" // Change status back to available if it was in maintenance
        });
      }
      
      res.json(maintenance);
    } catch (error) {
      console.error("Complete maintenance error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Activity Log routes
  app.get("/api/activity-logs", authenticate, async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const activities = await storage.listRecentActivity(limit);
      
      // Enrich the activity logs with user and vehicle data
      const enrichedActivities = await Promise.all(activities.map(async (activity) => {
        let userData = null;
        let vehicleData = null;
        
        if (activity.userId) {
          const user = await storage.getUser(activity.userId);
          if (user) {
            userData = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName
            };
          }
        }
        
        if (activity.vehicleId) {
          const vehicle = await storage.getVehicle(activity.vehicleId);
          if (vehicle) {
            vehicleData = {
              id: vehicle.id,
              vehicleId: vehicle.vehicleId,
              make: vehicle.make,
              model: vehicle.model
            };
          }
        }
        
        return {
          ...activity,
          user: userData,
          vehicle: vehicleData
        };
      }));
      
      res.json(enrichedActivities);
    } catch (error) {
      console.error("List activity logs error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Fuel Report routes
  app.post("/api/fuel-reports", authenticate, async (req, res) => {
    try {
      const fuelReportData = insertFuelReportSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      const fuelReport = await storage.createFuelReport(fuelReportData);
      res.status(201).json(fuelReport);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid fuel report data", errors: error.errors });
      }
      console.error("Create fuel report error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/vehicles/:id/fuel-reports", authenticate, async (req, res) => {
    try {
      const vehicleId = Number(req.params.id);
      const reports = await storage.listFuelReportsForVehicle(vehicleId);
      res.json(reports);
    } catch (error) {
      console.error("List fuel reports error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Geofence routes
  app.get("/api/geofences", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const geofences = await storage.listGeofences();
      res.json(geofences);
    } catch (error) {
      console.error("List geofences error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/geofences", authenticate, authorize(["admin", "fleet_supervisor", "super_admin"]), async (req, res) => {
    try {
      const geofenceData = insertGeofenceSchema.parse({
        ...req.body,
        createdBy: req.session.userId
      });
      
      const geofence = await storage.createGeofence(geofenceData);
      res.status(201).json(geofence);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid geofence data", errors: error.errors });
      }
      console.error("Create geofence error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Alert routes
  app.get("/api/alerts", authenticate, async (req, res) => {
    try {
      const alerts = await storage.listUnreadAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("List alerts error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/alerts/:id/read", authenticate, async (req, res) => {
    try {
      const alertId = Number(req.params.id);
      const alert = await storage.markAlertAsRead(alertId);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.json(alert);
    } catch (error) {
      console.error("Mark alert as read error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Dashboard summary data
  app.get("/api/dashboard/summary", authenticate, async (req, res) => {
    try {
      const vehicles = await storage.listVehicles();
      const users = await storage.listUsers();
      const alerts = await storage.listUnreadAlerts();
      const maintenanceRecords = await storage.listUpcomingMaintenance();

      const summary = {
        totalVehicles: vehicles.length,
        activeRiders: users.filter(u => u.role === "rider" && u.active).length,
        maintenanceDue: maintenanceRecords.length,
        alerts: alerts.length,
        // Calculate status counts
        vehicleStatusCounts: {
          available: vehicles.filter(v => v.status === "available").length,
          inUse: vehicles.filter(v => v.status === "in_use").length,
          maintenance: vehicles.filter(v => v.status === "maintenance").length,
          serviceDue: vehicles.filter(v => v.status === "service_due").length,
        }
      };

      res.json(summary);
    } catch (error) {
      console.error("Dashboard summary error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
