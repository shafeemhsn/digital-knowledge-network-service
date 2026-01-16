import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/user.enity";
import { PublishingScope } from "./compliance.enums";

export interface IPublishingRecord {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  scope: PublishingScope;
  publishedBy?: User;
  publishedAt: Date;
}
