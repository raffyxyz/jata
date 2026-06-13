"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AuthUseCases } from "@/lib/application/use-cases/auth";
import { SupabaseAuthRepository } from "@/lib/infrastructure/repositories/supabase-auth.repository";
import type { AuthSession, AuthUser } from "@/lib/core/domain/entities/auth";

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authUseCases = new AuthUseCases(new SupabaseAuthRepository());

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentSession = await authUseCases.getCurrentSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      }
      setIsLoading(false);
    };

    init();

    const unsubscribe = authUseCases.onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authUseCases.login(email, password);
  }, []);

  const logout = useCallback(async () => {
    await authUseCases.logout();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout }}>
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
