import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/entity/user.enity";

export interface IAuditRecord {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  findings: string;
  auditedBy?: User;
  auditedAt: Date;
}
