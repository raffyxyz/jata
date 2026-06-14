import type { GeneratedDocument } from "@/lib/core/domain/entities/generated-document";

export interface GeneratedDocumentRepository {
  findByApplicationId(applicationId: string): Promise<GeneratedDocument[]>;
  findByUserId(userId: string): Promise<GeneratedDocument[]>;
  create(data: {
    applicationId: string;
    type: string;
    content: string;
  }): Promise<GeneratedDocument>;
}
