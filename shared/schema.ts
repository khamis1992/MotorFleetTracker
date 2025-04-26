import { pgTable, text, serial, integer, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Role Enum
export const userRoleEnum = pgEnum('user_role', ['rider', 'fleet_supervisor', 'admin', 'super_admin']);

// Vehicle Status Enum
export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'in_use', 'maintenance', 'service_due']);

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default('rider'),
  phone: text("phone"),
  profileImage: text("profile_image"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicle Table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  vehicleId: text("vehicle_id").notNull().unique(), // e.g. MBK-1023
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  licensePlate: text("license_plate").notNull(),
  vin: text("vin").notNull(),
  status: vehicleStatusEnum("status").notNull().default('available'),
  fuelCapacity: integer("fuel_capacity"), // in liters
  assignedTo: integer("assigned_to").references(() => users.id),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// GPS Location Table
export const gpsLocations = pgTable("gps_locations", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  speed: integer("speed"), // in km/h
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Maintenance Table
export const maintenance = pgTable("maintenance", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  type: text("type").notNull(), // e.g. "Oil Change", "Tire Replacement"
  description: text("description").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  cost: integer("cost"), // in cents
  technician: text("technician"),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity Logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  action: text("action").notNull(), // e.g. "vehicle_checkout", "maintenance_complete"
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Fuel Reports
export const fuelReports = pgTable("fuel_reports", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // in milliliters
  cost: integer("cost").notNull(), // in cents
  odometer: integer("odometer").notNull(), // in kilometers
  reportDate: timestamp("report_date").defaultNow().notNull(),
  notes: text("notes"),
});

// Geofences
export const geofences = pgTable("geofences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coordinates: text("coordinates").notNull(), // JSON string of polygon coordinates
  active: boolean("active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alert Types Enum
export const alertTypeEnum = pgEnum('alert_type', ['geofence_exit', 'geofence_enter', 'maintenance_due', 'speed_limit', 'idle_time']);

// Alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  type: alertTypeEnum("type").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Create Zod schemas for insert operations
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  uuid: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  uuid: true,
  createdAt: true,
});

export const insertGpsLocationSchema = createInsertSchema(gpsLocations).omit({
  id: true,
  timestamp: true,
});

export const insertMaintenanceSchema = createInsertSchema(maintenance).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertFuelReportSchema = createInsertSchema(fuelReports).omit({
  id: true,
  reportDate: true,
});

export const insertGeofenceSchema = createInsertSchema(geofences).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

// Define types for all tables
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type GpsLocation = typeof gpsLocations.$inferSelect;
export type InsertGpsLocation = z.infer<typeof insertGpsLocationSchema>;

export type Maintenance = typeof maintenance.$inferSelect;
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type FuelReport = typeof fuelReports.$inferSelect;
export type InsertFuelReport = z.infer<typeof insertFuelReportSchema>;

export type Geofence = typeof geofences.$inferSelect;
export type InsertGeofence = z.infer<typeof insertGeofenceSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
