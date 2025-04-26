import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Plus,
  Minus,
  Navigation,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Vehicle, GpsLocation } from "@/types";
import { useMap } from "@/hooks/use-map";

const GpsTrackingPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [locationsMap, setLocationsMap] = useState<{[key: number]: GpsLocation}>({});
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Fetch vehicles
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // Setup map
  const { mapRef, isLoaded, updateVehicleMarkers, panTo, zoomIn, zoomOut } = useMap(mapContainerRef, {
    zoom: 9,
    center: [-74.5, 40],
  });

  // Filtered vehicles based on search and selection
  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = searchQuery === "" ||
      vehicle.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSelection = selectedVehicle === null || vehicle.id.toString() === selectedVehicle;
    
    return matchesSearch && matchesSelection;
  }) || [];

  // Count online vehicles (vehicles with GPS data)
  const onlineVehiclesCount = Object.keys(locationsMap).length;

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

  // Update markers when vehicles or locations change
  useEffect(() => {
    if (isLoaded && !isLoadingVehicles && !isLoadingLocations) {
      updateVehicleMarkers(filteredVehicles, locationsMap);
    }
  }, [filteredVehicles, locationsMap, isLoaded, isLoadingVehicles, isLoadingLocations, updateVehicleMarkers]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Vehicles</CardTitle>
            <CardDescription>
              {onlineVehiclesCount} of {vehicles?.length || 0} online
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[calc(100vh-200px)]">
            {isLoadingVehicles ? (
              <div className="text-center py-8">Loading vehicles...</div>
            ) : !vehicles || vehicles.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No vehicles found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredVehicles.map((vehicle) => {
                  const isOnline = !!locationsMap[vehicle.id];
                  return (
                    <div 
                      key={vehicle.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedVehicle === vehicle.id.toString()
                          ? "bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-800"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => {
                        setSelectedVehicle(
                          selectedVehicle === vehicle.id.toString() ? null : vehicle.id.toString()
                        );
                        
                        // If location exists, pan to it
                        if (locationsMap[vehicle.id]) {
                          const loc = locationsMap[vehicle.id];
                          panTo(parseFloat(loc.latitude), parseFloat(loc.longitude));
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{vehicle.vehicleId}</h3>
                            <div 
                              className={`ml-2 w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} 
                              title={isOnline ? "Online" : "Offline"}
                            ></div>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                        <Badge className={getStatusBadgeClass(vehicle.status)}>
                          {formatStatus(vehicle.status)}
                        </Badge>
                      </div>
                      
                      {locationsMap[vehicle.id] && (
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <div>
                            <p>Speed:</p>
                            <p className="font-medium">{locationsMap[vehicle.id].speed || 0} km/h</p>
                          </div>
                          <div>
                            <p>Last update:</p>
                            <p className="font-medium">
                              {new Date(locationsMap[vehicle.id].timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>GPS Tracking</CardTitle>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-3">
                  {onlineVehiclesCount} Online
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsLoadingLocations(true);
                    // Refresh locations
                    setTimeout(() => {
                      setIsLoadingLocations(false);
                    }, 1000);
                  }}
                  className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-700 hover:bg-primary-100 dark:hover:bg-slate-600"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mapContainerRef} 
              className="h-[calc(100vh-160px)] relative rounded-b-lg" 
            >
              {(isLoadingVehicles || isLoadingLocations) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/75 dark:bg-slate-900/75 z-10">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="animate-spin h-8 w-8 text-primary-500 mb-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Loading map data...</span>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
                <Button 
                  variant="outline" 
                  className="bg-white dark:bg-slate-800 p-2 h-10 w-10 rounded-lg shadow-md"
                  onClick={zoomIn}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white dark:bg-slate-800 p-2 h-10 w-10 rounded-lg shadow-md"
                  onClick={zoomOut}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white dark:bg-slate-800 p-2 h-10 w-10 rounded-lg shadow-md"
                  onClick={() => {
                    // Center on the first vehicle if available
                    const firstVehicleId = Object.keys(locationsMap)[0];
                    if (firstVehicleId) {
                      const location = locationsMap[parseInt(firstVehicleId)];
                      panTo(parseFloat(location.latitude), parseFloat(location.longitude));
                    }
                  }}
                >
                  <Navigation className="h-5 w-5" />
                </Button>
              </div>

              <div className="absolute top-4 left-4 z-10">
                <Card className="shadow-lg">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">3 Active Alerts</span>
                      <Button size="sm" variant="link" className="text-xs h-auto p-0">
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GpsTrackingPage;
