import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">RiderLink</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fleet management for motorbike fleets
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
