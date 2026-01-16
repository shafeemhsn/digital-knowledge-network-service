import { KnowledgeResource } from "../enity/knowledge-resource.enity";

export interface IKnowledgeVersion {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  versionNo: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}
