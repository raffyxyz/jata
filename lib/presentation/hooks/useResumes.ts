import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ResumeData {
  id: string;
  name: string | null;
  fileUrl: string;
  parsedText: string | null;
  createdAt: string;
}

async function fetchResumes(): Promise<ResumeData[]> {
  const res = await fetch("/api/resumes");
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export function useResumes() {
  return useQuery<ResumeData[]>({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Delete failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}
