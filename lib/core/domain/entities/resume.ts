export interface Resume {
  id: string;
  userId: string;
  name: string | null;
  fileUrl: string;
  parsedText: string | null;
  createdAt: string;
}
