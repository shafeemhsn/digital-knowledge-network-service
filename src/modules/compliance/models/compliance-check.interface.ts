import { KnowledgeResource } from "../../knowledge-resources/models/knowledge-resource.model";
import { User } from "../../users/models/user.model";

export interface IComplianceCheck {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  gdpr_compliant: boolean;
  localisation_compliant: boolean;
  checked_by?: User;
  checked_at: Date;
}
