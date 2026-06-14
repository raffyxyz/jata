import type { GeneratedDocumentRepository } from "@/lib/core/domain/ports/generated-document.repository";
import type { GeneratedDocument } from "@/lib/core/domain/entities/generated-document";

export class GeneratedDocumentUseCases {
  constructor(private readonly repository: GeneratedDocumentRepository) {}

  async getUserDocuments(userId: string): Promise<GeneratedDocument[]> {
    return this.repository.findByUserId(userId);
  }

  async saveDocument(data: {
    applicationId: string;
    type: string;
    content: string;
  }): Promise<GeneratedDocument> {
    return this.repository.create(data);
  }
}
