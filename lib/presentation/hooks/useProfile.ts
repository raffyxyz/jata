import { useMutation } from "@tanstack/react-query";
import type { AuthUser } from "@/lib/core/domain/entities/auth";

interface UpdateProfileParams {
  name: string;
  aiProvider?: string;
}

async function updateProfile(params: UpdateProfileParams): Promise<AuthUser> {
  const res = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateProfile(params),
  });
}
