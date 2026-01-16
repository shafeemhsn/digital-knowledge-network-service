import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/user.enity";
import { ValidationDecision } from "./compliance.enums";

export interface IValidationRecord {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  decision: ValidationDecision;
  validatedBy?: User;
  validatedAt: Date;
}
