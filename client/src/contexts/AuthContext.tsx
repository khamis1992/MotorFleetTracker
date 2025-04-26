import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User, LoginCredentials, AuthState } from "@/types";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to authenticate",
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      const user = await res.json();
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      // Redirect based on user role
      if (user.role === "rider") {
        setLocation("/dashboard/rider");
      } else {
        setLocation("/dashboard/admin");
      }
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to login",
      });
    }
  };

  // Logout function
  const logout = async () => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      await apiRequest("POST", "/api/auth/logout");
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      setLocation("/login");
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to logout",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
