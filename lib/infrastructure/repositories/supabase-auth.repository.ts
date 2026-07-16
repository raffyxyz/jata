import type { AuthRepository, UpdateProfileParams } from "@/lib/core/domain/ports/auth.repository";
import type { AuthSession, AuthUser } from "@/lib/core/domain/entities/auth";
import { createClient } from "@/lib/infrastructure/supabase/client";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";

function mapUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    createdAt: user.created_at,
  };
}

function mapSession(session: Session): AuthSession {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
    user: mapUser(session.user),
  };
}

export class SupabaseAuthRepository implements AuthRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient();
  }

  async signInWithOAuth(provider: "google"): Promise<string> {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.url;
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session) {
      throw new Error("No session returned from sign in");
    }

    return mapSession(data.session);
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.client.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session) return null;

    return mapSession(data.session);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getUser();

    if (error || !data.user) return null;

    return mapUser(data.user);
  }

  async updateProfile(params: UpdateProfileParams): Promise<AuthUser> {
    const { data, error } = await this.client.auth.updateUser({
      data: { name: params.name },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("No user returned from profile update");
    }

    return mapUser(data.user);
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange((_event, session) => {
      callback(session ? mapSession(session) : null);
    });

    return () => subscription.unsubscribe();
  }
}
