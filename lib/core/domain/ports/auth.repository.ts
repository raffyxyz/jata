import type { AuthSession, AuthUser } from "@/lib/core/domain/entities/auth";

export interface UpdateProfileParams {
  name: string;
}

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthSession>;
  signInWithOAuth(provider: "google"): Promise<string>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  updateProfile(params: UpdateProfileParams): Promise<AuthUser>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
