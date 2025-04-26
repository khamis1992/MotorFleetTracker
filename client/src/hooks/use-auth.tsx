import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { UserRole } from "@/types";

// Hook to protect routes that require authentication
export function useProtectedRoute(allowedRoles: UserRole[] = []) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation("/login");
      } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect based on role if they don't have permission
        if (user.role === "rider") {
          setLocation("/dashboard/rider");
        } else {
          setLocation("/dashboard/admin");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, setLocation]);

  return { isAuthenticated, isLoading, user };
}

// Hook for login page - redirect if already logged in
export function useRedirectAuthenticated() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "rider") {
        setLocation("/dashboard/rider");
      } else {
        setLocation("/dashboard/admin");
      }
    }
  }, [isAuthenticated, isLoading, user, setLocation]);

  return { isAuthenticated, isLoading };
}
