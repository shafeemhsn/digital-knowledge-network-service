import { KnowledgeResource } from "../../knowledge-resources/models/knowledge-resource.model";
import { User } from "../../users/models/user.model";

export interface IAuditRecord {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  findings: string;
  audited_by?: User;
  audited_at: Date;
}
