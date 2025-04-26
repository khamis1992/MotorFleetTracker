import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Fuel,
  Check,
  AlertTriangle,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Vehicle, ActivityLog, GpsLocation } from "@/types";
import { formatDistance, format } from "date-fns";

const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Get assigned vehicle to the current rider
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });
  
  // Get assigned vehicle
  const assignedVehicle = vehicles?.find(v => v.assignedTo === user?.id);

  // Get recent activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activity-logs'],
  });

  // Filter activities related to this rider
  const riderActivities = activities?.filter(a => a.userId === user?.id);

  // Get current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Mock function to clock in/out
  const handleClockInOut = async () => {
    if (!assignedVehicle || !currentLocation) return;
    
    try {
      // Record GPS location
      await fetch('/api/gps-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          vehicleId: assignedVehicle.id,
          latitude: currentLocation.lat.toString(),
          longitude: currentLocation.lng.toString(),
          speed: 0
        })
      });

      // Log clock in/out activity
      await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          vehicleId: assignedVehicle.id,
          action: "rider_clock_in",
          description: `Rider clocked in with ${assignedVehicle.vehicleId}`
        })
      });

    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };

  // Request maintenance
  const requestMaintenance = async () => {
    if (!assignedVehicle) return;
    
    try {
      // Create maintenance request
      await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          vehicleId: assignedVehicle.id,
          type: "Service Request",
          description: "Rider-initiated service request",
          scheduledDate: new Date().toISOString(),
          createdBy: user?.id
        })
      });

    } catch (error) {
      console.error("Error requesting maintenance:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Hello, {user?.firstName || "Rider"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ready for assignments</p>
              </div>
              <div className="ml-auto">
                <Button onClick={handleClockInOut}>
                  Clock Out
                </Button>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Shift Time</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Started 4 hours ago</p>
              </div>
              <div className="ml-auto w-1/3">
                <div className="flex justify-between text-xs mb-1">
                  <span>4h</span>
                  <span>8h</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Vehicle */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {assignedVehicle ? "Assigned Vehicle" : "No Vehicle Assigned"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingVehicles ? (
            <div className="text-center py-4">Loading vehicle data...</div>
          ) : !assignedVehicle ? (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400">
              You don't have any vehicle assigned currently.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Bike className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{assignedVehicle.vehicleId}</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {assignedVehicle.make} {assignedVehicle.model} ({assignedVehicle.year})
                  </p>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" onClick={requestMaintenance}>
                    Request Service
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm font-medium">Fuel Level</span>
                  </div>
                  <p className="text-lg font-semibold mt-1">75%</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Route className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">Odometer</span>
                  </div>
                  <p className="text-lg font-semibold mt-1">12,450 km</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm font-medium">Next Service</span>
                  </div>
                  <p className="text-lg font-semibold mt-1">
                    {assignedVehicle.nextMaintenanceDate 
                      ? formatDistance(new Date(assignedVehicle.nextMaintenanceDate), new Date(), { addSuffix: true })
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoadingActivities ? (
              <li className="py-4 text-center">Loading activities...</li>
            ) : !riderActivities || riderActivities.length === 0 ? (
              <li className="py-4 text-center text-slate-500 dark:text-slate-400">
                No recent activities found
              </li>
            ) : (
              riderActivities.slice(0, 5).map((activity) => (
                <li key={activity.id} className="py-3">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                      <i className="fas fa-key"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

// Import needed for Bike icon
import { Bike } from "lucide-react";

export default RiderDashboard;
