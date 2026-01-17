import { KnowledgeResourceStatus } from "./knowledge-resource.status";
import { User } from "../../users/entity/user.enity";

export interface IKnowledgeResource {
  id?: string;
  title: string;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  status?: KnowledgeResourceStatus;
  duplicateFlag?: boolean;
  outdatedFlag?: boolean;
  rating?: number;
  ratingCount?: number;
  views?: number;
  publishedAt?: Date | null;
  hasPersonalData?: boolean;
  hasClientInfo?: boolean;
  uploadedBy?: User;
}
