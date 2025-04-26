import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bike, 
  Users, 
  Bolt, 
  AlertTriangle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import MapView from "@/components/dashboard/MapView";
import ActivityItem from "@/components/dashboard/ActivityItem";
import VehicleTable from "@/components/dashboard/VehicleTable";
import { DashboardSummary, ActivityLog, Vehicle, GpsLocation } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminDashboard: React.FC = () => {
  // Fetch dashboard summary
  const { data: summary, isLoading: isLoadingSummary } = useQuery<DashboardSummary>({
    queryKey: ['/api/dashboard/summary'],
  });

  // Fetch activity logs
  const { data: activities, isLoading: isLoadingActivities } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activity-logs'],
  });

  // Fetch vehicles for table and map
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // State for vehicle GPS locations
  const [locationsMap, setLocationsMap] = useState<{[key: number]: GpsLocation}>({});
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(true);

  // Fetch GPS locations for each vehicle
  useEffect(() => {
    const fetchLocations = async () => {
      if (!vehicles || vehicles.length === 0) return;
      
      setIsLoadingLocations(true);
      const locationMap: {[key: number]: GpsLocation} = {};
      
      try {
        // We'll fetch locations for each vehicle and combine them
        await Promise.all(vehicles.map(async (vehicle) => {
          try {
            const response = await fetch(`/api/vehicles/${vehicle.id}/latest-location`, {
              credentials: 'include'
            });
            
            if (response.ok) {
              const location = await response.json();
              locationMap[vehicle.id] = location;
            }
          } catch (error) {
            console.error(`Error fetching location for vehicle ${vehicle.id}:`, error);
          }
        }));
        
        setLocationsMap(locationMap);
      } catch (error) {
        console.error("Error fetching GPS locations:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [vehicles]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
        <div className="space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Role: Admin
          </span>
          <Button size="sm" className="inline-flex items-center shadow-sm">
            <Plus className="h-4 w-4 mr-1" /> New Task
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={isLoadingSummary ? "Loading..." : summary?.totalVehicles || 0}
          icon={Bike}
          viewAllLink="/vehicles"
          colorClass="bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
        />
        <StatCard
          title="Active Riders"
          value={isLoadingSummary ? "Loading..." : summary?.activeRiders || 0}
          icon={Users}
          viewAllLink="/riders"
          colorClass="bg-green-50 dark:bg-slate-700 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Maintenance Due"
          value={isLoadingSummary ? "Loading..." : summary?.maintenanceDue || 0}
          icon={Bolt}
          viewAllLink="/maintenance"
          colorClass="bg-amber-50 dark:bg-slate-700 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Alerts"
          value={isLoadingSummary ? "Loading..." : summary?.alerts || 0}
          icon={AlertTriangle}
          viewAllLink="#alerts"
          colorClass="bg-red-50 dark:bg-slate-700 text-red-600 dark:text-red-400"
        />
      </div>

      {/* GPS Tracking Map and Activity Feed */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView 
            vehicles={vehicles || []}
            locations={locationsMap}
            isLoading={isLoadingVehicles || isLoadingLocations}
          />
        </div>

        {/* Recent Activity */}
        <Card className="shadow overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <Button variant="link" className="text-xs" asChild>
                <a href="#view-all-activities">View all</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
              {isLoadingActivities ? (
                <li className="p-8 text-center text-slate-500 dark:text-slate-400">
                  Loading activities...
                </li>
              ) : !activities || activities.length === 0 ? (
                <li className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No recent activities found
                </li>
              ) : (
                activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Status Table */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
          <VehicleTable 
            vehicles={vehicles || []} 
            isLoading={isLoadingVehicles}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
