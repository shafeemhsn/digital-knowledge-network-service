import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/user.enity";

export interface IComplianceCheck {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  gdprCompliant: boolean;
  localisationCompliant: boolean;
  checkedBy?: User;
  checkedAt: Date;
}
