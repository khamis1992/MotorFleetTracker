import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bike,
  Calendar,
  MapPin,
  User,
  Drill,
  Fuel,
  FileText,
  BarChart,
  Clipboard
} from "lucide-react";
import { Vehicle, Maintenance, ActivityLog, GpsLocation, FuelReport, User as UserType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import MapView from "@/components/dashboard/MapView";
import { formatDistance } from "date-fns";

interface VehicleDetailsProps {
  id: string;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ id }) => {
  const { user } = useAuth();
  const [latestLocation, setLatestLocation] = useState<GpsLocation | null>(null);

  // Fetch vehicle details
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery<Vehicle>({
    queryKey: [`/api/vehicles/${id === "assigned" ? "1" : id}`], // If "assigned", use a placeholder ID
    enabled: id !== "assigned", // Don't fetch if we're looking for the assigned vehicle
  });

  // If looking for assigned vehicle, fetch all vehicles and find the assigned one
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
    enabled: id === "assigned",
  });

  // Find the assigned vehicle if in rider mode
  const assignedVehicle = id === "assigned" && !isLoadingVehicles 
    ? vehicles?.find(v => v.assignedTo === user?.id)
    : null;
  
  // Use either the directly fetched vehicle or the assigned one
  const currentVehicle = id === "assigned" ? assignedVehicle : vehicle;

  // Fetch maintenance history
  const { data: maintenanceHistory, isLoading: isLoadingMaintenance } = useQuery<Maintenance[]>({
    queryKey: [`/api/maintenance?vehicleId=${currentVehicle?.id}`],
    enabled: !!currentVehicle?.id,
  });

  // Fetch activity logs
  const { data: activityLogs, isLoading: isLoadingActivities } = useQuery<ActivityLog[]>({
    queryKey: [`/api/activity-logs?vehicleId=${currentVehicle?.id}`],
    enabled: !!currentVehicle?.id,
  });

  // Fetch fuel reports
  const { data: fuelReports, isLoading: isLoadingFuel } = useQuery<FuelReport[]>({
    queryKey: [`/api/vehicles/${currentVehicle?.id}/fuel-reports`],
    enabled: !!currentVehicle?.id,
  });

  // Fetch latest location
  useEffect(() => {
    if (currentVehicle?.id) {
      fetch(`/api/vehicles/${currentVehicle.id}/latest-location`, {
        credentials: 'include'
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch location');
      })
      .then(data => setLatestLocation(data))
      .catch(err => console.error('Error fetching location:', err));
    }
  }, [currentVehicle]);

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in_use":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "maintenance":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "service_due":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    }
  };

  if (id === "assigned" && !isLoadingVehicles && !assignedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Bike className="h-16 w-16 text-slate-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Vehicle Assigned</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4">You don't have any vehicle assigned to you at the moment.</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/rider">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if ((isLoadingVehicle && id !== "assigned") || (id === "assigned" && isLoadingVehicles)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!currentVehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Vehicle Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4">The requested vehicle could not be found.</p>
        <Button variant="outline" asChild>
          <Link href="/vehicles">Back to Vehicles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4" asChild>
          <Link href={id === "assigned" ? "/dashboard/rider" : "/vehicles"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{currentVehicle.vehicleId}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {currentVehicle.make} {currentVehicle.model}, {currentVehicle.year}
          </p>
        </div>
        <Badge className={`ml-4 ${getStatusBadgeClass(currentVehicle.status)}`}>
          {formatStatus(currentVehicle.status)}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Make</dt>
                    <dd className="text-sm font-semibold">{currentVehicle.make}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Model</dt>
                    <dd className="text-sm font-semibold">{currentVehicle.model}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Year</dt>
                    <dd className="text-sm font-semibold">{currentVehicle.year}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">License</dt>
                    <dd className="text-sm font-semibold">{currentVehicle.licensePlate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">VIN</dt>
                    <dd className="text-sm font-semibold">{currentVehicle.vin}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Fuel Capacity</dt>
                    <dd className="text-sm font-semibold">{currentVehicle.fuelCapacity || "N/A"} L</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                    <dd className="text-sm font-semibold">{formatStatus(currentVehicle.status)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                {currentVehicle.assignedTo ? (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Assigned since January 12, 2023</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 dark:text-slate-400">Not currently assigned</p>
                    <Button className="mt-4" size="sm">Assign Rider</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">Next Service</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {currentVehicle.nextMaintenanceDate 
                          ? formatDistance(new Date(currentVehicle.nextMaintenanceDate), new Date(), { addSuffix: true })
                          : "Not scheduled"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                      <Drill className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Last Service</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {currentVehicle.lastMaintenanceDate 
                          ? formatDistance(new Date(currentVehicle.lastMaintenanceDate), new Date(), { addSuffix: true })
                          : "No record"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <Drill className="h-4 w-4 mr-2" /> Schedule Maintenance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Location</CardTitle>
              <CardDescription>
                Last updated: {latestLocation ? new Date(latestLocation.timestamp).toLocaleString() : 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestLocation ? (
                <div className="h-[300px] relative rounded-md overflow-hidden">
                  <MapView 
                    vehicles={[currentVehicle]} 
                    locations={{[currentVehicle.id]: latestLocation}} 
                    isLoading={false}
                  />
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 dark:text-slate-400">No location data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Maintenance History</CardTitle>
                <Button size="sm">
                  <Drill className="h-4 w-4 mr-2" /> Schedule Maintenance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingMaintenance ? (
                <div className="text-center py-8">Loading maintenance records...</div>
              ) : !maintenanceHistory || maintenanceHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Clipboard className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No maintenance records found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {maintenanceHistory.map((record) => (
                    <div key={record.id} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{record.type}</h3>
                        <Badge variant="outline" className={record.completedDate ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                          {record.completedDate ? "Completed" : "Scheduled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{record.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Scheduled Date</p>
                          <p className="font-medium">{new Date(record.scheduledDate).toLocaleDateString()}</p>
                        </div>
                        {record.completedDate && (
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Completed Date</p>
                            <p className="font-medium">{new Date(record.completedDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        {record.cost && (
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Cost</p>
                            <p className="font-medium">${(record.cost / 100).toFixed(2)}</p>
                          </div>
                        )}
                        {record.technician && (
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Technician</p>
                            <p className="font-medium">{record.technician}</p>
                          </div>
                        )}
                      </div>
                      {record.notes && (
                        <div className="mt-2">
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Notes</p>
                          <p className="text-sm">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>GPS Tracking</CardTitle>
              <CardDescription>
                Real-time location and tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] relative rounded-md overflow-hidden mb-6">
                <MapView 
                  vehicles={[currentVehicle]} 
                  locations={latestLocation ? {[currentVehicle.id]: latestLocation} : {}} 
                  isLoading={false}
                />
              </div>
              
              {latestLocation && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Coordinates</h3>
                    <p className="text-sm">Latitude: {latestLocation.latitude}</p>
                    <p className="text-sm">Longitude: {latestLocation.longitude}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Speed</h3>
                    <p className="text-sm">{latestLocation.speed || 0} km/h</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Last Updated</h3>
                    <p className="text-sm">{new Date(latestLocation.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="text-center py-8">Loading activity logs...</div>
              ) : !activityLogs || activityLogs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No activity logs found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-slate-200 dark:border-slate-700 pl-4 pb-6 relative">
                      <div className="absolute w-3 h-3 rounded-full bg-primary-500 left-[-6.5px] top-1"></div>
                      <p className="font-medium">{log.description}</p>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <span>{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fuel Reports Tab */}
        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fuel Reports</CardTitle>
                <Button size="sm">
                  <Fuel className="h-4 w-4 mr-2" /> Add Fuel Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingFuel ? (
                <div className="text-center py-8">Loading fuel reports...</div>
              ) : !fuelReports || fuelReports.length === 0 ? (
                <div className="text-center py-8">
                  <Fuel className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No fuel reports found</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Fuel Consumption</h3>
                    <div className="h-60 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <BarChart className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h3 className="font-medium mb-4">Recent Reports</h3>
                    <div className="space-y-4">
                      {fuelReports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex justify-between items-start bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                          <div>
                            <p className="font-medium">{(report.amount / 1000).toFixed(2)} L</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date(report.reportDate).toLocaleDateString()} • 
                              Odometer: {report.odometer} km
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(report.cost / 100).toFixed(2)}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              ${((report.cost / report.amount) * 1000).toFixed(2)}/L
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetails;
