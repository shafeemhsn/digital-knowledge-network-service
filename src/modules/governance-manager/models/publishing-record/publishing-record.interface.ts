import { KnowledgeResource } from "../../../knowledge-manager/knowledge-resources/models/knowledge-resource.model";
import { User } from "../../../users/models/user.model";
import { PublishingScope } from "../compliance-check/compliance.enums";

export interface IPublishingRecord {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  scope: PublishingScope;
  published_by?: User;
  published_at: Date;
}
