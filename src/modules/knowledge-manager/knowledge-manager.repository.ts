import { EntityManager } from "typeorm";

import { KnowledgeResource } from "./enity/knowledge-resource.enity";
import { KnowledgeMetadata } from "./enity/knowledge-metadata.entity";
import { KnowledgeVersion } from "./enity/knowledge-version.entity";
import { IKnowledgeResource } from "./interface/knowledge-resource.interface";
import { IKnowledgeMetadata } from "./interface/knowledge-metadata.interface";
import { IKnowledgeVersion } from "./interface/knowledge-version.interface";
import { User } from "../users/entity/user.enity";
import logger from "../../util/logger";

export const createKnowledgeResource = async (
  manager: EntityManager,
  data: IKnowledgeResource,
  uploader: User
): Promise<KnowledgeResource> => {
  try {
    const knowledgeRepository = manager.getRepository(KnowledgeResource);
    const resource = knowledgeRepository.create({
      title: data.title,
      description: data.description ?? null,
      uploadedBy: uploader,
    });
    return await knowledgeRepository.save(resource);
  } catch (error: any) {
    logger.error(`Error creating knowledge resource: ${error.message}`);
    throw error;
  }
};

export const createKnowledgeMetadata = async (
  manager: EntityManager,
  data: IKnowledgeMetadata
): Promise<KnowledgeMetadata> => {
  try {
    const metadataRepository = manager.getRepository(KnowledgeMetadata);
    const metadata = metadataRepository.create({
      knowledgeResourceId: data.knowledgeResourceId,
      documentType: data.documentType,
      projectName: data.projectName,
      domain: data.domain,
      tags: data.tags ?? null,
    });
    return await metadataRepository.save(metadata);
  } catch (error: any) {
    logger.error(`Error creating knowledge metadata: ${error.message}`);
    throw error;
  }
};

export const createKnowledgeVersion = async (
  manager: EntityManager,
  data: IKnowledgeVersion
): Promise<KnowledgeVersion> => {
  try {
    const versionRepository = manager.getRepository(KnowledgeVersion);
    const version = versionRepository.create({
      knowledgeResourceId: data.knowledgeResourceId,
      versionNo: data.versionNo,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize,
    });
    return await versionRepository.save(version);
  } catch (error: any) {
    logger.error(`Error creating knowledge version: ${error.message}`);
    throw error;
  }
};
