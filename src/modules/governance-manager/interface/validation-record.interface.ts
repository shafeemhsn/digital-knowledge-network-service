import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/user.enity";
import { ValidationDecision } from "./compliance.enums";

export interface IValidationRecord {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  decision: ValidationDecision;
  validated_by?: User;
  validated_at: Date;
}
