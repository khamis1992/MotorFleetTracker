import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";
import RiderLayout from "@/layouts/RiderLayout";

// Auth Pages
import Login from "@/pages/login";

// Admin Pages
import AdminDashboard from "@/pages/dashboard/admin";
import Vehicles from "@/pages/vehicles/index";
import VehicleDetails from "@/pages/vehicles/details";
import GpsTracking from "@/pages/gps-tracking";
import Maintenance from "@/pages/maintenance/index";
import Riders from "@/pages/riders/index";
import Finance from "@/pages/finance/index";
import Settings from "@/pages/settings";

// Rider Pages
import RiderDashboard from "@/pages/dashboard/rider";

function App() {
  return (
    <TooltipProvider>
      <Switch>
        {/* Auth Routes */}
        <Route path="/login" component={Login} />
        
        {/* Admin Routes */}
        <Route path="/dashboard/admin">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </Route>
        
        <Route path="/vehicles">
          <AdminLayout>
            <Vehicles />
          </AdminLayout>
        </Route>
        
        <Route path="/vehicles/:id">
          {(params) => (
            <AdminLayout>
              <VehicleDetails id={params.id} />
            </AdminLayout>
          )}
        </Route>
        
        <Route path="/gps-tracking">
          <AdminLayout>
            <GpsTracking />
          </AdminLayout>
        </Route>
        
        <Route path="/maintenance">
          <AdminLayout>
            <Maintenance />
          </AdminLayout>
        </Route>
        
        <Route path="/riders">
          <AdminLayout>
            <Riders />
          </AdminLayout>
        </Route>
        
        <Route path="/finance">
          <AdminLayout>
            <Finance />
          </AdminLayout>
        </Route>
        
        <Route path="/settings">
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </Route>
        
        {/* Rider Routes */}
        <Route path="/dashboard/rider">
          <RiderLayout>
            <RiderDashboard />
          </RiderLayout>
        </Route>
        
        <Route path="/rider/vehicle">
          <RiderLayout>
            <VehicleDetails id="assigned" />
          </RiderLayout>
        </Route>
        
        <Route path="/rider/status">
          <RiderLayout>
            <div className="container mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Rider Status</h1>
              {/* Status content */}
            </div>
          </RiderLayout>
        </Route>
        
        <Route path="/rider/profile">
          <RiderLayout>
            <div className="container mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Profile</h1>
              {/* Profile content */}
            </div>
          </RiderLayout>
        </Route>
        
        {/* Root redirect to login */}
        <Route path="/">
          {() => {
            window.location.href = "/login";
            return null;
          }}
        </Route>
        
        {/* 404 page */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
