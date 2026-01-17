import { EntityManager, In } from "typeorm";
import { AppDataSource } from "../../config/db";

import { KnowledgeResource } from "./enity/knowledge-resource.enity";
import { KnowledgeMetadata } from "./enity/knowledge-metadata.entity";
import { KnowledgeVersion } from "./enity/knowledge-version.entity";
import { IKnowledgeResource } from "./interface/knowledge-resource.interface";
import {
  IKnowledgeMetadata,
  KnowledgeUploadInput,
} from "./interface/knowledge-metadata.interface";
import { IKnowledgeVersion } from "./interface/knowledge-version.interface";
import { KnowledgeResourceStatus } from "./interface/knowledge-resource.status";
import { User } from "../users/entity/user.enity";
import { Region } from "../geo-location/entity/region.entity";
import logger from "../../util/logger";
import HttpException from "../../util/http-exception.model";

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
      content: data.content ?? null,
      category: data.category ?? null,
      status: data.status,
      hasPersonalData: data.hasPersonalData ?? false,
      hasClientInfo: data.hasClientInfo ?? false,
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
      regionId: data.regionId,
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

export const createKnowledgeUpload = async (input: KnowledgeUploadInput) => {
  return await AppDataSource.transaction(async (manager) => {
    const userRepository = manager.getRepository(User);
    const uploader = await userRepository.findOne({
      where: { id: input.uploadedById },
    });

    if (!uploader) {
      throw new HttpException(404, {
        message: `Uploader not found: ${input.uploadedById}`,
        result: false,
      });
    }

    const regionRepository = manager.getRepository(Region);
    const region = await regionRepository.findOne({
      where: { id: input.metadata.regionId },
    });

    if (!region) {
      throw new HttpException(404, {
        message: `Region not found: ${input.metadata.regionId}`,
        result: false,
      });
    }

    const resource = await createKnowledgeResource(
      manager,
      {
        title: input.title.trim(),
        description: input.description ?? null,
        content: input.content ?? null,
        category: input.category?.trim() ?? null,
        status: KnowledgeResourceStatus.PENDING_COMPLIANCE,
        hasPersonalData: !!input.hasPersonalData,
        hasClientInfo: !!input.hasClientInfo,
      },
      uploader
    );

    const metadata = await createKnowledgeMetadata(manager, {
      knowledgeResourceId: resource,
      regionId: region,
      documentType: input.metadata.documentType.trim(),
      projectName: input.metadata.projectName.trim(),
      domain: input.metadata.domain.trim(),
      tags: normalizeTags(input.metadata.tags),
    });

    const version = await createKnowledgeVersion(manager, {
      knowledgeResourceId: resource,
      versionNo: input.version.versionNo ?? 1,
      fileName: input.version.fileName.trim(),
      fileUrl: input.version.fileUrl.trim(),
      fileSize: input.version.fileSize,
    });

    return { resource, metadata, version };
  });
};

export const getKnowledgeResourcesWithUploader = async () => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  return await knowledgeRepository.find({
    relations: { uploadedBy: true },
    order: { createdAt: "DESC" },
  });
};

export const getKnowledgeResourceById = async (id: string) => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  return await knowledgeRepository.findOne({ where: { id } });
};

export const getKnowledgeResourceByIdWithUploader = async (id: string) => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  return await knowledgeRepository.findOne({
    where: { id },
    relations: { uploadedBy: true },
  });
};

export const saveKnowledgeResource = async (resource: KnowledgeResource) => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  return await knowledgeRepository.save(resource);
};

export const removeKnowledgeResource = async (resource: KnowledgeResource) => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  return await knowledgeRepository.remove(resource);
};

export const getMetadataAndVersions = async (resourceIds: string[]) => {
  if (!resourceIds.length) {
    return { metadataMap: new Map(), versionMap: new Map() };
  }

  const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
  const versionRepository = AppDataSource.getRepository(KnowledgeVersion);

  const metadataItems = await metadataRepository.find({
    where: { knowledgeResourceId: { id: In(resourceIds) } },
    relations: { knowledgeResourceId: true, regionId: true },
  });

  const versionItems = await versionRepository.find({
    where: { knowledgeResourceId: { id: In(resourceIds) } },
    relations: { knowledgeResourceId: true },
  });

  const metadataMap = new Map<string, KnowledgeMetadata>();
  metadataItems.forEach((item) => {
    const resourceId = item.knowledgeResourceId?.id;
    if (resourceId) {
      metadataMap.set(resourceId, item);
    }
  });

  const versionMap = new Map<string, KnowledgeVersion>();
  versionItems.forEach((item) => {
    const resourceId = item.knowledgeResourceId?.id;
    if (!resourceId) {
      return;
    }

    const existing = versionMap.get(resourceId);
    if (!existing || item.versionNo > existing.versionNo) {
      versionMap.set(resourceId, item);
    }
  });

  return { metadataMap, versionMap };
};

export const getPublishedKnowledgeResources = async () => {
  const knowledgeRepository = AppDataSource.getRepository(KnowledgeResource);
  return await knowledgeRepository.find({
    where: { status: KnowledgeResourceStatus.PUBLISHED },
    relations: { uploadedBy: true },
  });
};

const normalizeTags = (tags?: string[] | string | null): string | null => {
  if (!tags) {
    return null;
  }

  if (Array.isArray(tags)) {
    return JSON.stringify(tags);
  }

  if (typeof tags === "string") {
    return tags;
  }

  return null;
};
