import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LoginCredentials } from "@/types";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Schema for login form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Direct login function that doesn't use the auth context
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }
      
      const user = await response.json();
      
      // Redirect based on user role
      if (user.role === "rider") {
        setLocation("/dashboard/rider");
      } else {
        setLocation("/dashboard/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const credentials: LoginCredentials = {
        email: values.email,
        password: values.password,
      };
      await login(credentials);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Demo login with predefined user
  const loginWithRole = async (role: string) => {
    setSelectedRole(role);
    try {
      const credentials: LoginCredentials = role === "admin" 
        ? { email: "admin@riderlink.com", password: "password123" }
        : { email: "rider@riderlink.com", password: "password123" };
      
      form.setValue("email", credentials.email);
      form.setValue("password", credentials.password);
      
      await login(credentials);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-50 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-primary-600 dark:bg-primary-700 p-6">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold text-2xl">
              R
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold text-white">RiderLink</h2>
          <p className="mt-2 text-center text-sm text-primary-200">Fleet Management System</p>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        type="email" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  or select role
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className={selectedRole === "admin" ? "border-primary-500" : ""}
                onClick={() => loginWithRole("admin")}
                disabled={isLoading}
              >
                <i className="fas fa-user-tie mr-2"></i>
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className={selectedRole === "rider" ? "border-primary-500" : ""}
                onClick={() => loginWithRole("rider")}
                disabled={isLoading}
              >
                <i className="fas fa-motorcycle mr-2"></i>
                Rider
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
