import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RiderNavbar from '../components/layout/RiderNavbar';

const RiderLayout = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'rider') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8">
          <Outlet />
        </div>
      </main>
      
      <RiderNavbar />
    </div>
  );
};

export default RiderLayout;
