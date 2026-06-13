import type { AuthSession, AuthUser } from "@/lib/core/domain/entities/auth";

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
