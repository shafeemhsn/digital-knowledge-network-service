import { KnowledgeResource } from "../enity/knowledge-resource.enity";
import { Region } from "../../geo-location/entity/region.entity";

export interface IKnowledgeMetadata {
  id?: string;
  knowledgeResourceId?: KnowledgeResource;
  regionId?: Region | null;
  documentType: string;
  projectName: string;
  domain: string;
  tags?: string | null;
}

export interface KnowledgeUploadInput {
  title: string;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  hasPersonalData?: boolean;
  hasClientInfo?: boolean;
  uploadedById: string;
  metadata: {
    documentType: string;
    projectName: string;
    domain: string;
    regionId: string;
    tags?: string[] | string | null;
  };
  version: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    versionNo?: number;
  };
}
