import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Icons
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Users,
  Wrench,
  Receipt,
  Settings,
  CircleDollarSign
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userRole: string;
}

const Sidebar = ({ open, setOpen, userRole }: SidebarProps) => {
  const location = useLocation();
  
  // Define navigation items for different roles
  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { 
      name: 'Fleet Management', 
      icon: Truck,
      children: [
        { name: 'Vehicles', href: '/admin/fleet/vehicles' },
        { name: 'Assignments', href: '/admin/fleet/assignments' },
        { name: 'Fuel Tracking', href: '/admin/fleet/fuel' },
      ] 
    },
    { 
      name: 'GPS Tracking', 
      icon: MapPin,
      children: [
        { name: 'Live Tracking', href: '/admin/tracking/gps' },
        { name: 'Geofence', href: '/admin/tracking/geofence' },
        { name: 'Reports', href: '/admin/tracking/reports' },
      ] 
    },
    { 
      name: 'HR Management', 
      icon: Users,
      children: [
        { name: 'Employees', href: '/admin/hr/employees' },
        { name: 'Documents', href: '/admin/hr/documents' },
        { name: 'Training', href: '/admin/hr/training' },
      ] 
    },
    { 
      name: 'Maintenance', 
      icon: Wrench,
      children: [
        { name: 'Tasks', href: '/admin/maintenance/tasks' },
        { name: 'Service History', href: '/admin/maintenance/history' },
        { name: 'Inspections', href: '/admin/maintenance/inspections' },
      ] 
    },
    { 
      name: 'Finance', 
      icon: CircleDollarSign,
      children: [
        { name: 'Invoices', href: '/admin/finance/invoices' },
        { name: 'Payments', href: '/admin/finance/payments' },
        { name: 'Reports', href: '/admin/finance/reports' },
      ] 
    },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Define the navigation based on user role
  const navigation = userRole === 'admin' || userRole === 'supervisor' 
    ? adminNavigation 
    : [];

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-40 flex md:hidden",
        open ? "block" : "hidden"
      )}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setOpen(false)} 
          aria-hidden="true" 
        />
        
        {/* Sidebar panel */}
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 dark:bg-gray-800">
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          {/* Mobile sidebar content */}
          <div className="flex flex-shrink-0 items-center px-4">
            <Link to="/" className="text-xl font-bold text-primary">
              RiderLink
            </Link>
          </div>
          
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <Fragment key={item.name}>
                  {!item.children ? (
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700",
                        "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                      )}
                    >
                      <item.icon
                        className={cn(
                          location.pathname === item.href
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                          "mr-4 h-6 w-6 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <button
                        type="button"
                        className={cn(
                          "group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                      <div className="space-y-1 pl-12">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              location.pathname === subItem.href
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700",
                              "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                            )}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="w-14 flex-shrink-0" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to="/" className="text-xl font-bold text-primary">
                RiderLink
              </Link>
            </div>
            
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Fragment key={item.name}>
                  {!item.children ? (
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700",
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                      )}
                    >
                      <item.icon
                        className={cn(
                          location.pathname === item.href
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                          "mr-3 h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <button
                        type="button"
                        className={cn(
                          "group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                      >
                        <item.icon
                          className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                      <div className="space-y-1 pl-10">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              location.pathname === subItem.href
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700",
                              "group flex items-center rounded-md px-2 py-2 text-sm"
                            )}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
