import React, { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "@/components/common/UserMenu";
import { useProtectedRoute } from "@/hooks/use-auth";
import { Logo } from "@/components/common/Logo";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiderLayoutProps {
  children: ReactNode;
}

export const RiderLayout: React.FC<RiderLayoutProps> = ({ children }) => {
  const { user } = useProtectedRoute(["rider"]);
  const [location] = useLocation();

  // Define navigation items for the mobile bottom bar
  const navigationItems = [
    { name: "Home", href: "/dashboard/rider", icon: "home" },
    { name: "Vehicle", href: "/rider/vehicle", icon: "motorcycle" },
    { name: "Status", href: "/rider/status", icon: "clock" },
    { name: "Profile", href: "/rider/profile", icon: "user" },
  ];

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Logo />
            
            <div className="flex items-center">
              <ThemeToggle />
              
              <Button
                variant="ghost"
                size="icon"
                className="mx-3 p-1 rounded-full text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none"
              >
                <Bell className="h-6 w-6" />
              </Button>
              
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Mobile navigation bar at bottom */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700 p-2 z-10">
        <div className="flex justify-around">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center space-y-1",
                  location === item.href
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400"
                )}
              >
                <i className={`fas fa-${item.icon}`}></i>
                <span className="text-xs">{item.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderLayout;
