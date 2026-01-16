import { KnowledgeResource } from "../../knowledge-resources/models/knowledge-resource.model";

export interface IKnowledgeMetadata {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  document_type: string;
  project_name: string;
  domain: string;
  tags?: string | null;
}
