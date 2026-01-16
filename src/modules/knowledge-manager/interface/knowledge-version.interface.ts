import { KnowledgeResource } from "../enity/knowledge-resource.enity";

export interface IKnowledgeVersion {
  id?: string;
  knowledge_resource_id?: KnowledgeResource;
  version_no: number;
  file_name: string;
  file_url: string;
  file_size: number;
}
