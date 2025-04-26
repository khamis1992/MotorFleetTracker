import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type UserRole = 'admin' | 'supervisor' | 'rider' | 'super_admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage first (faster initial load)
    const storedUser = localStorage.getItem('rider-link-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('rider-link-user');
      }
    }

    // Then check Supabase session
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            role: profile?.role || 'rider',
            name: profile?.name || '',
            avatar_url: profile?.avatar_url,
          };

          setUser(userData);
          localStorage.setItem('rider-link-user', JSON.stringify(userData));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('rider-link-user');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          role: profile?.role || 'rider',
          name: profile?.name || '',
          avatar_url: profile?.avatar_url,
        };

        setUser(userData);
        localStorage.setItem('rider-link-user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // User info is set by the auth state listener
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async function signUp(email: string, password: string, name: string, role: UserRole) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              name,
              role,
              created_at: new Date(),
            },
          ]);

        if (profileError) {
          return { success: false, error: profileError.message };
        }
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('rider-link-user');
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
