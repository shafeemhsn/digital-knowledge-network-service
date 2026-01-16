import { KnowledgeResource } from "../enity/knowledge-resource.enity";

export interface IKnowledgeMetadata {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  documentType: string;
  projectName: string;
  domain: string;
  tags?: string | null;
}
