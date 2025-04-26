import {
  users, vehicles, gpsLocations, maintenance, activityLogs, fuelReports, geofences, alerts,
  type User, type InsertUser, 
  type Vehicle, type InsertVehicle,
  type GpsLocation, type InsertGpsLocation,
  type Maintenance, type InsertMaintenance,
  type ActivityLog, type InsertActivityLog,
  type FuelReport, type InsertFuelReport,
  type Geofence, type InsertGeofence,
  type Alert, type InsertAlert
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  
  // Vehicle operations
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByVehicleId(vehicleId: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  listVehicles(): Promise<Vehicle[]>;
  getVehiclesByStatus(status: string): Promise<Vehicle[]>;
  assignVehicleToUser(vehicleId: number, userId: number): Promise<Vehicle | undefined>;
  
  // GPS Location operations
  createGpsLocation(gpsLocation: InsertGpsLocation): Promise<GpsLocation>;
  getLatestGpsLocation(vehicleId: number): Promise<GpsLocation | undefined>;
  listGpsLocationsForVehicle(vehicleId: number, limit?: number): Promise<GpsLocation[]>;
  
  // Maintenance operations
  createMaintenance(maintenance: InsertMaintenance): Promise<Maintenance>;
  updateMaintenance(id: number, maintenanceData: Partial<InsertMaintenance>): Promise<Maintenance | undefined>;
  getMaintenanceById(id: number): Promise<Maintenance | undefined>;
  listMaintenanceForVehicle(vehicleId: number): Promise<Maintenance[]>;
  listUpcomingMaintenance(): Promise<Maintenance[]>;
  
  // Activity Log operations
  createActivityLog(activityLog: InsertActivityLog): Promise<ActivityLog>;
  listRecentActivity(limit?: number): Promise<ActivityLog[]>;
  
  // Fuel Report operations
  createFuelReport(fuelReport: InsertFuelReport): Promise<FuelReport>;
  listFuelReportsForVehicle(vehicleId: number): Promise<FuelReport[]>;
  
  // Geofence operations
  createGeofence(geofence: InsertGeofence): Promise<Geofence>;
  updateGeofence(id: number, geofenceData: Partial<InsertGeofence>): Promise<Geofence | undefined>;
  getGeofence(id: number): Promise<Geofence | undefined>;
  listGeofences(): Promise<Geofence[]>;
  
  // Alert operations
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<Alert | undefined>;
  listUnreadAlerts(): Promise<Alert[]>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private vehiclesMap: Map<number, Vehicle>;
  private gpsLocationsMap: Map<number, GpsLocation>;
  private maintenanceMap: Map<number, Maintenance>;
  private activityLogsMap: Map<number, ActivityLog>;
  private fuelReportsMap: Map<number, FuelReport>;
  private geofencesMap: Map<number, Geofence>;
  private alertsMap: Map<number, Alert>;
  
  private userId: number;
  private vehicleId: number;
  private gpsLocationId: number;
  private maintenanceId: number;
  private activityLogId: number;
  private fuelReportId: number;
  private geofenceId: number;
  private alertId: number;

  constructor() {
    this.usersMap = new Map();
    this.vehiclesMap = new Map();
    this.gpsLocationsMap = new Map();
    this.maintenanceMap = new Map();
    this.activityLogsMap = new Map();
    this.fuelReportsMap = new Map();
    this.geofencesMap = new Map();
    this.alertsMap = new Map();
    
    this.userId = 1;
    this.vehicleId = 1;
    this.gpsLocationId = 1;
    this.maintenanceId = 1;
    this.activityLogId = 1;
    this.fuelReportId = 1;
    this.geofenceId = 1;
    this.alertId = 1;
    
    // Initialize with some default data
    this.seedData();
  }

  // Seed method to create initial data
  private seedData() {
    // Seed initial admin user
    this.createUser({
      email: "admin@riderlink.com",
      password: "password123", // in production, this would be hashed
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "123-456-7890",
      profileImage: "",
      active: true
    });

    // Seed initial rider user
    this.createUser({
      email: "rider@riderlink.com",
      password: "password123", // in production, this would be hashed
      firstName: "John",
      lastName: "Smith",
      role: "rider",
      phone: "123-456-7891",
      profileImage: "",
      active: true
    });
    
    // Seed some vehicles
    this.createVehicle({
      vehicleId: "MBK-1023",
      make: "Yamaha",
      model: "YBR 125",
      year: 2022,
      licensePlate: "ABC123",
      vin: "1HGCM82633A123456",
      status: "in_use",
      fuelCapacity: 10,
      assignedTo: 2, // Assigned to rider
      lastMaintenanceDate: new Date("2023-01-12T00:00:00Z"),
      nextMaintenanceDate: new Date("2023-04-12T00:00:00Z")
    });
    
    this.createVehicle({
      vehicleId: "MBK-1065",
      make: "Honda",
      model: "CBF 150",
      year: 2021,
      licensePlate: "DEF456",
      vin: "1HGCM82633A654321",
      status: "available",
      fuelCapacity: 12,
      assignedTo: null,
      lastMaintenanceDate: new Date("2023-02-03T00:00:00Z"),
      nextMaintenanceDate: new Date("2023-05-03T00:00:00Z")
    });

    this.createVehicle({
      vehicleId: "MBK-1089",
      make: "Suzuki",
      model: "GS 150",
      year: 2020,
      licensePlate: "GHI789",
      vin: "1HGCM82633A789012",
      status: "maintenance",
      fuelCapacity: 11,
      assignedTo: null,
      lastMaintenanceDate: new Date("2022-12-27T00:00:00Z"),
      nextMaintenanceDate: new Date("2023-03-27T00:00:00Z")
    });
    
    // Seed GPS locations
    this.createGpsLocation({
      vehicleId: 1,
      latitude: "40.7128",
      longitude: "-74.0060",
      speed: 30
    });
    
    this.createGpsLocation({
      vehicleId: 2,
      latitude: "40.7129",
      longitude: "-74.0061",
      speed: 0
    });
    
    this.createGpsLocation({
      vehicleId: 3,
      latitude: "40.7130",
      longitude: "-74.0062",
      speed: 0
    });
    
    // Seed activity logs
    this.createActivityLog({
      userId: 2,
      vehicleId: 1,
      action: "vehicle_checkout",
      description: "Vehicle MBK-1023 checked out"
    });
    
    this.createActivityLog({
      userId: null,
      vehicleId: 3,
      action: "maintenance_complete",
      description: "Maintenance completed"
    });
    
    this.createActivityLog({
      userId: 2,
      vehicleId: null,
      action: "fuel_reported",
      description: "Fuel reported"
    });
    
    this.createActivityLog({
      userId: null,
      vehicleId: 3,
      action: "geofence_exit",
      description: "Alert: Geofence exit"
    });
    
    // Seed alerts
    this.createAlert({
      vehicleId: 1,
      type: "maintenance_due",
      message: "Maintenance due in 5 days",
      read: false
    });
    
    this.createAlert({
      vehicleId: 3,
      type: "geofence_exit",
      message: "Vehicle exited designated area",
      read: false
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...userData, 
      id, 
      uuid: crypto.randomUUID(),
      createdAt: now
    };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }

  // Vehicle operations
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehiclesMap.get(id);
  }

  async getVehicleByVehicleId(vehicleId: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehiclesMap.values()).find(
      vehicle => vehicle.vehicleId === vehicleId
    );
  }

  async createVehicle(vehicleData: InsertVehicle): Promise<Vehicle> {
    const id = this.vehicleId++;
    const now = new Date();
    const vehicle: Vehicle = {
      ...vehicleData,
      id,
      uuid: crypto.randomUUID(),
      createdAt: now
    };
    this.vehiclesMap.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const existingVehicle = await this.getVehicle(id);
    if (!existingVehicle) return undefined;
    
    const updatedVehicle = { ...existingVehicle, ...vehicleData };
    this.vehiclesMap.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async listVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehiclesMap.values());
  }

  async getVehiclesByStatus(status: string): Promise<Vehicle[]> {
    return Array.from(this.vehiclesMap.values()).filter(
      vehicle => vehicle.status === status
    );
  }

  async assignVehicleToUser(vehicleId: number, userId: number): Promise<Vehicle | undefined> {
    const vehicle = await this.getVehicle(vehicleId);
    if (!vehicle) return undefined;
    
    vehicle.assignedTo = userId;
    vehicle.status = "in_use";
    this.vehiclesMap.set(vehicleId, vehicle);
    
    // Create an activity log for this assignment
    await this.createActivityLog({
      userId,
      vehicleId,
      action: "vehicle_assigned",
      description: `Vehicle ${vehicle.vehicleId} assigned to user ID ${userId}`
    });
    
    return vehicle;
  }

  // GPS Location operations
  async createGpsLocation(gpsLocationData: InsertGpsLocation): Promise<GpsLocation> {
    const id = this.gpsLocationId++;
    const now = new Date();
    const gpsLocation: GpsLocation = {
      ...gpsLocationData,
      id,
      timestamp: now
    };
    this.gpsLocationsMap.set(id, gpsLocation);
    return gpsLocation;
  }

  async getLatestGpsLocation(vehicleId: number): Promise<GpsLocation | undefined> {
    const locations = await this.listGpsLocationsForVehicle(vehicleId, 1);
    return locations.length > 0 ? locations[0] : undefined;
  }

  async listGpsLocationsForVehicle(vehicleId: number, limit?: number): Promise<GpsLocation[]> {
    const locations = Array.from(this.gpsLocationsMap.values())
      .filter(location => location.vehicleId === vehicleId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? locations.slice(0, limit) : locations;
  }

  // Maintenance operations
  async createMaintenance(maintenanceData: InsertMaintenance): Promise<Maintenance> {
    const id = this.maintenanceId++;
    const now = new Date();
    const maintenanceRecord: Maintenance = {
      ...maintenanceData,
      id,
      createdAt: now
    };
    this.maintenanceMap.set(id, maintenanceRecord);
    return maintenanceRecord;
  }

  async updateMaintenance(id: number, maintenanceData: Partial<InsertMaintenance>): Promise<Maintenance | undefined> {
    const existingMaintenance = await this.getMaintenanceById(id);
    if (!existingMaintenance) return undefined;
    
    const updatedMaintenance = { ...existingMaintenance, ...maintenanceData };
    this.maintenanceMap.set(id, updatedMaintenance);
    return updatedMaintenance;
  }

  async getMaintenanceById(id: number): Promise<Maintenance | undefined> {
    return this.maintenanceMap.get(id);
  }

  async listMaintenanceForVehicle(vehicleId: number): Promise<Maintenance[]> {
    return Array.from(this.maintenanceMap.values())
      .filter(maintenance => maintenance.vehicleId === vehicleId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listUpcomingMaintenance(): Promise<Maintenance[]> {
    const now = new Date();
    return Array.from(this.maintenanceMap.values())
      .filter(maintenance => 
        maintenance.scheduledDate > now && 
        !maintenance.completedDate
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  // Activity Log operations
  async createActivityLog(activityLogData: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogId++;
    const now = new Date();
    const activityLog: ActivityLog = {
      ...activityLogData,
      id,
      timestamp: now
    };
    this.activityLogsMap.set(id, activityLog);
    return activityLog;
  }

  async listRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogsMap.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Fuel Report operations
  async createFuelReport(fuelReportData: InsertFuelReport): Promise<FuelReport> {
    const id = this.fuelReportId++;
    const now = new Date();
    const fuelReport: FuelReport = {
      ...fuelReportData,
      id,
      reportDate: now
    };
    this.fuelReportsMap.set(id, fuelReport);
    
    // Create an activity log for this fuel report
    await this.createActivityLog({
      userId: fuelReportData.userId,
      vehicleId: fuelReportData.vehicleId,
      action: "fuel_reported",
      description: `Fuel report submitted for vehicle ID ${fuelReportData.vehicleId}`
    });
    
    return fuelReport;
  }

  async listFuelReportsForVehicle(vehicleId: number): Promise<FuelReport[]> {
    return Array.from(this.fuelReportsMap.values())
      .filter(report => report.vehicleId === vehicleId)
      .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }

  // Geofence operations
  async createGeofence(geofenceData: InsertGeofence): Promise<Geofence> {
    const id = this.geofenceId++;
    const now = new Date();
    const geofence: Geofence = {
      ...geofenceData,
      id,
      createdAt: now
    };
    this.geofencesMap.set(id, geofence);
    return geofence;
  }

  async updateGeofence(id: number, geofenceData: Partial<InsertGeofence>): Promise<Geofence | undefined> {
    const existingGeofence = await this.getGeofence(id);
    if (!existingGeofence) return undefined;
    
    const updatedGeofence = { ...existingGeofence, ...geofenceData };
    this.geofencesMap.set(id, updatedGeofence);
    return updatedGeofence;
  }

  async getGeofence(id: number): Promise<Geofence | undefined> {
    return this.geofencesMap.get(id);
  }

  async listGeofences(): Promise<Geofence[]> {
    return Array.from(this.geofencesMap.values());
  }

  // Alert operations
  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const now = new Date();
    const alert: Alert = {
      ...alertData,
      id,
      timestamp: now
    };
    this.alertsMap.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const alert = this.alertsMap.get(id);
    if (!alert) return undefined;
    
    alert.read = true;
    this.alertsMap.set(id, alert);
    return alert;
  }

  async listUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alertsMap.values())
      .filter(alert => !alert.read)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
