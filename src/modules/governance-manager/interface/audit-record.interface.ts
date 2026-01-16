import { KnowledgeResource } from "../../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../../users/user.enity";

export interface IAuditRecord {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  findings: string;
  audited_by?: User;
  audited_at: Date;
}
