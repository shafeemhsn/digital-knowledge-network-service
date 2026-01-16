import { KnowledgeResource } from "../../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../../users/user.enity";
import { PublishingScope } from "../../interface/compliance.enums";

export interface IPublishingRecord {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  scope: PublishingScope;
  published_by?: User;
  published_at: Date;
}
