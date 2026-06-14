import { useQuery } from "@tanstack/react-query";

export interface DocumentListItem {
  id: string;
  type: string;
  company: string;
  role: string;
  createdAt: string;
}

async function fetchDocuments(): Promise<DocumentListItem[]> {
  const res = await fetch("/api/generated-documents");
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export function useGeneratedDocuments() {
  return useQuery<DocumentListItem[]>({
    queryKey: ["generated-documents"],
    queryFn: fetchDocuments,
  });
}
