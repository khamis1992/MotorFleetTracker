// Common types used throughout the application

// User related types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
}

export type UserRole = 'rider' | 'fleet_supervisor' | 'admin' | 'super_admin';

// Vehicle related types
export interface Vehicle {
  id: number;
  uuid: string;
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: VehicleStatus;
  fuelCapacity?: number;
  assignedTo?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
}

export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'service_due';

// GPS Location related types
export interface GpsLocation {
  id: number;
  vehicleId: number;
  latitude: string;
  longitude: string;
  speed?: number;
  timestamp: string;
}

// Maintenance related types
export interface Maintenance {
  id: number;
  vehicleId: number;
  type: string;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  technician?: string;
  notes?: string;
  createdBy?: number;
  createdAt: string;
}

// Activity related types
export interface ActivityLog {
  id: number;
  userId?: number;
  vehicleId?: number;
  action: string;
  description: string;
  timestamp: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  vehicle?: {
    id: number;
    vehicleId: string;
    make: string;
    model: string;
  };
}

// Fuel report related types
export interface FuelReport {
  id: number;
  vehicleId: number;
  userId: number;
  amount: number; // in milliliters
  cost: number; // in cents
  odometer: number; // in kilometers
  reportDate: string;
  notes?: string;
}

// Geofence related types
export interface Geofence {
  id: number;
  name: string;
  description?: string;
  coordinates: string; // JSON string of polygon coordinates
  active: boolean;
  createdBy?: number;
  createdAt: string;
}

// Alert related types
export interface Alert {
  id: number;
  vehicleId?: number;
  type: AlertType;
  message: string;
  read: boolean;
  timestamp: string;
}

export type AlertType = 'geofence_exit' | 'geofence_enter' | 'maintenance_due' | 'speed_limit' | 'idle_time';

// Dashboard summary data
export interface DashboardSummary {
  totalVehicles: number;
  activeRiders: number;
  maintenanceDue: number;
  alerts: number;
  vehicleStatusCounts: {
    available: number;
    inUse: number;
    maintenance: number;
    serviceDue: number;
  };
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
