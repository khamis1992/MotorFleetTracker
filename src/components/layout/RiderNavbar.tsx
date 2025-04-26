import { Link, useLocation } from 'react-router-dom';
import { Home, Truck, User, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const RiderNavbar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/rider', icon: Home },
    { name: 'Vehicle', href: '/rider/vehicle', icon: Truck },
    { name: 'Clock In/Out', href: '/rider/clock', icon: Clock },
    { name: 'Profile', href: '/rider/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-col items-center py-2 px-1 text-xs font-medium",
              location.pathname === item.href
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <item.icon 
              className={cn(
                "mb-1 h-6 w-6",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-300"
              )}
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default RiderNavbar;
