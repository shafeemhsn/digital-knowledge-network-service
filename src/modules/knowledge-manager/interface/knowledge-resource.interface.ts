import { KnowledgeResourceStatus } from "./knowledge-resource.status";
import { User } from "../../users/user.enity";

export interface IKnowledgeResource {
  id?: string;
  title: string;
  description?: string | null;
  status?: KnowledgeResourceStatus;
  duplicateFlag?: boolean;
  outdatedFlag?: boolean;
  uploadedBy?: User;
}
