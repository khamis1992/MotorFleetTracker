import React, { useRef, useEffect, useState } from "react";
import { useMap } from "@/hooks/use-map";
import { Button } from "@/components/ui/button";
import { Vehicle, GpsLocation } from "@/types";
import { Plus, Minus, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MapViewProps {
  vehicles: Vehicle[];
  locations: { [key: number]: GpsLocation };
  isLoading?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  vehicles,
  locations,
  isLoading = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { mapRef, isLoaded, updateVehicleMarkers, zoomIn, zoomOut, panTo } = useMap(mapContainerRef, {
    zoom: 9,
    center: [-74.5, 40],
  });

  // Count online vehicles (vehicles with GPS data)
  const onlineVehiclesCount = Object.keys(locations).length;

  // Update markers when vehicles or locations change
  useEffect(() => {
    if (isLoaded && !isLoading) {
      updateVehicleMarkers(vehicles, locations);
    }
  }, [vehicles, locations, isLoaded, isLoading, updateVehicleMarkers]);

  return (
    <Card className="shadow">
      <CardHeader className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">GPS Tracking</CardTitle>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-3">
              {onlineVehiclesCount} Online
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-700 hover:bg-primary-100 dark:hover:bg-slate-600"
              onClick={() => {
                if (isLoaded && !isLoading) {
                  updateVehicleMarkers(vehicles, locations);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapContainerRef} 
          className="h-96 relative rounded-b-lg" 
          style={{ 
            background: isLoaded ? undefined : "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJDMiAxNy41MjMgNi40NzcgMjIgMTIgMjJDMTcuNTIzIDIyIDIyIDE3LjUyMyAyMiAxMkMyMiA2LjQ3NyAxNy41MjMgMiAxMiAyWiIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTIgMTZWMTIiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyIDhWOCIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')" 
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/75 dark:bg-slate-900/75">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-primary-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-slate-600 dark:text-slate-300">Loading map data...</span>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
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
                const firstVehicleId = Object.keys(locations)[0];
                if (firstVehicleId) {
                  const location = locations[parseInt(firstVehicleId)];
                  panTo(parseFloat(location.latitude), parseFloat(location.longitude));
                }
              }}
            >
              <Navigation className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
