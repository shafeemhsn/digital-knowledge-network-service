import { KnowledgeResource } from "../../../knowledge-resources/models/knowledge-resource.model";
import { User } from "../../../users/models/user.model";
import { ValidationDecision } from "../compliance-check/compliance.enums";

export interface IValidationRecord {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  decision: ValidationDecision;
  validated_by?: User;
  validated_at: Date;
}
