import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApplicationData } from "@/components/applications/ApplicationRow";

async function fetchApplications(): Promise<ApplicationData[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) throw new Error("Failed to fetch applications");
  const data = await res.json();
  return data.map(
    (app: Omit<ApplicationData, "dateAdded"> & { dateAdded: string }) => ({
      ...app,
      dateAdded: new Date(app.dateAdded),
    }),
  );
}

export function useApplications() {
  return useQuery<ApplicationData[]>({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete application");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
