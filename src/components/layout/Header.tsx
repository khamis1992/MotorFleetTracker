import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { 
  Menu, 
  Moon, 
  Sun, 
  Bell, 
  User,
  LogOut, 
  Settings,
  ChevronDown,
  MenuIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps {
  openSidebar: () => void;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    avatar_url?: string;
  };
}

const Header = ({ openSidebar, user }: HeaderProps) => {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            onClick={openSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">RiderLink</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                <span className="sr-only">View notifications</span>
                <Bell size={20} />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <button className="text-xs text-primary hover:underline">Mark all as read</button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <div className="rounded-full bg-primary/20 p-2 text-primary">
                        <Bell size={16} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New vehicle assignment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vehicle KCH 123Z has been assigned to John Doe
                      </p>
                      <p className="mt-1 text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="border-t p-4 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                  <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0">
                      <div className="rounded-full bg-red-100 p-2 text-red-500 dark:bg-red-900/30">
                        <Bell size={16} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Maintenance alert</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vehicle KCH 456Y is due for service
                      </p>
                      <p className="mt-1 text-xs text-gray-400">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <Link to="/notifications" className="text-sm text-primary hover:underline">
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <div className="relative h-8 w-8 rounded-full bg-primary/10 text-primary">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={18} />
                    </div>
                  )}
                </div>
                <span className="hidden font-medium md:block">
                  {user.name}
                </span>
                <ChevronDown size={16} className="hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex w-full cursor-pointer items-center">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="flex cursor-pointer items-center text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
