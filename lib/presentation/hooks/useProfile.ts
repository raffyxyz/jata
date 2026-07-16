import { useMutation } from "@tanstack/react-query";
import type { AuthUser } from "@/lib/core/domain/entities/auth";

async function updateProfile(name: string): Promise<AuthUser> {
  const res = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (name: string) => updateProfile(name),
  });
}
