import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const SuperAdminLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'super_admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        userRole={user.role}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          openSidebar={() => setSidebarOpen(true)} 
          user={user} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
