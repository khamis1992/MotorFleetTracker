import React, { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { UserMenu } from "@/components/common/UserMenu";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { SearchIcon, Menu, Bell } from "lucide-react";
import { useProtectedRoute } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

// Navigation items for the sidebar
const navigationItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: "tachometer-alt" },
  { name: "Vehicles", href: "/vehicles", icon: "motorcycle" },
  { name: "GPS Tracking", href: "/gps-tracking", icon: "map-marker-alt" },
  { name: "Maintenance", href: "/maintenance", icon: "tools" },
  { name: "Riders", href: "/riders", icon: "users" },
  { name: "Finance", href: "/finance", icon: "file-invoice-dollar" },
  { name: "Settings", href: "/settings", icon: "cog" },
];

interface AdminLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children,
  allowedRoles = ["admin", "fleet_supervisor", "super_admin"] 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useProtectedRoute(allowedRoles as any[]);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "md:flex md:w-64 md:flex-col h-full transition-all duration-300 ease-in-out",
          sidebarOpen ? "flex absolute z-40 w-64 h-full md:relative" : "hidden"
        )}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <Logo className="flex-shrink-0 px-4 mb-5" />
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === item.href
                      ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-100"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  )}
                >
                  <i className={`fas fa-${item.icon} mr-3 ${location === item.href ? "text-primary-500" : "text-slate-400"}`}></i>
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top header */}
        <div className="z-10 flex-shrink-0 flex h-16 bg-white dark:bg-slate-800 shadow-sm">
          <button
            type="button"
            className="md:hidden px-4 text-slate-500 dark:text-slate-200 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="max-w-2xl w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative text-slate-400 focus-within:text-slate-600">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                  <Input
                    id="search"
                    placeholder="Search"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-700 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:placeholder-slate-400 dark:focus:placeholder-slate-500 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 sm:text-sm"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
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

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
