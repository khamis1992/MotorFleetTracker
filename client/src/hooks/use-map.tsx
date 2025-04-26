import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GpsLocation, Vehicle } from "@/types";

// Default Mapbox token - should be replaced with environment variable in production
const DEFAULT_MAPBOX_TOKEN = "pk.eyJ1IjoicmlkZXJsaW5rIiwiYSI6ImNrNDRmejFzcjEwMXAza21vdDF3ZzZ3Z3IifQ.iK7PYz65lMwUWgLUQbB6gQ";
// Using import.meta.env instead of process.env for Vite
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN;

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_TOKEN;

interface UseMapOptions {
  zoom?: number;
  center?: [number, number];
}

export function useMap(containerRef: React.RefObject<HTMLDivElement>, options: UseMapOptions = {}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: options.center || [-74.5, 40], // Default coordinates
      zoom: options.zoom || 9
    });

    map.on("load", () => {
      setIsLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, options.center, options.zoom]);

  // Update vehicle markers on the map
  const updateVehicleMarkers = (
    vehicles: Vehicle[],
    locations: { [key: number]: GpsLocation }
  ) => {
    if (!mapRef.current || !isLoaded) return;

    // Remove markers that are no longer needed
    Object.keys(markersRef.current).forEach(id => {
      const vehicleId = parseInt(id);
      if (!vehicles.some(v => v.id === vehicleId)) {
        markersRef.current[vehicleId].remove();
        delete markersRef.current[vehicleId];
      }
    });

    // Update or add markers for current vehicles
    vehicles.forEach(vehicle => {
      const location = locations[vehicle.id];
      if (!location) return;

      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      let marker = markersRef.current[vehicle.id];
      
      if (!marker) {
        // Create a custom element for the marker
        const el = document.createElement("div");
        el.className = `marker-${vehicle.status}`;
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.borderRadius = "50%";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        
        // Set background color based on vehicle status
        switch(vehicle.status) {
          case "in_use":
            el.style.backgroundColor = "#22c55e"; // green-500
            break;
          case "maintenance":
            el.style.backgroundColor = "#ef4444"; // red-500
            break;
          case "service_due":
            el.style.backgroundColor = "#f59e0b"; // amber-500
            break;
          default:
            el.style.backgroundColor = "#3b82f6"; // blue-500
        }
        
        // Add motorcycle icon
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v2m-3-3h-4l-3-3m-4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v2"></path><circle cx="5" cy="17" r="2"></circle><circle cx="19" cy="17" r="2"></circle></svg>`;
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${vehicle.vehicleId}</h3>
            <p>${vehicle.make} ${vehicle.model}</p>
            <p>Status: ${vehicle.status.replace("_", " ")}</p>
            ${location.speed ? `<p>Speed: ${location.speed} km/h</p>` : ''}
          </div>
        `);

        // Create and add the marker
        marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current);
          
        markersRef.current[vehicle.id] = marker;
      } else {
        // Update existing marker position
        marker.setLngLat([lng, lat]);
      }
    });

    // If there are markers, fit the map to show all of them
    if (Object.keys(markersRef.current).length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      
      Object.values(locations).forEach(location => {
        const lat = parseFloat(location.latitude);
        const lng = parseFloat(location.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lng, lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    }
  };

  // Other map control functions
  const panTo = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo([lng, lat]);
    }
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return { mapRef, isLoaded, updateVehicleMarkers, panTo, zoomIn, zoomOut };
}
