import { KnowledgeResourceStatus } from "./knowledge-resource.status";
import { User } from "../../users/user.enity";

export interface IKnowledgeResource {
  id?: string;
  title: string;
  description?: string | null;
  status?: KnowledgeResourceStatus;
  duplicate_flag?: boolean;
  outdated_flag?: boolean;
  uploaded_by?: User;
}
