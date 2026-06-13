import type { AuthRepository } from "@/lib/core/domain/ports/auth.repository";
import type { AuthSession, AuthUser } from "@/lib/core/domain/entities/auth";

export class AuthUseCases {
  constructor(private readonly repository: AuthRepository) {}

  async login(email: string, password: string): Promise<AuthSession> {
    return this.repository.signIn(email, password);
  }

  async logout(): Promise<void> {
    await this.repository.signOut();
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    return this.repository.getSession();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.repository.getCurrentUser();
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    return this.repository.onAuthStateChange(callback);
  }
}
