import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/user.enity";

export interface IComplianceCheck {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  gdpr_compliant: boolean;
  localisation_compliant: boolean;
  checked_by?: User;
  checked_at: Date;
}
