import { User } from "../users/entity/user.enity";
import { validateUserById } from "../users/user.service";
import {
  createKnowledgeUpload,
  getKnowledgeResourcesWithUploader,
  getMetadataAndVersions,
  getKnowledgeResourceById,
  getKnowledgeResourceByIdWithUploader,
  getPublishedKnowledgeResources as getPublishedKnowledgeResourcesFromRepo,
  removeKnowledgeResource,
  saveKnowledgeResource,
} from "./knowledge-manager.repository";
import { KnowledgeResource } from "./enity/knowledge-resource.enity";
import { KnowledgeMetadata } from "./enity/knowledge-metadata.entity";
import { KnowledgeVersion } from "./enity/knowledge-version.entity";
import { KnowledgeResourceStatus } from "./interface/knowledge-resource.status";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { KnowledgeUploadInput } from "./interface/knowledge-metadata.interface";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const uploadKnowledge = async (input: KnowledgeUploadInput) => {
  try {
    logger.info("Uploading knowledge resource");

    if (!isNonEmptyString(input?.title)) {
      throw new HttpException(400, {
        message: "Title is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input?.category)) {
      throw new HttpException(400, {
        message: "Category is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input?.uploadedById)) {
      throw new HttpException(400, {
        message: "uploadedById is required",
        result: false,
      });
    }

    if (!input?.metadata) {
      throw new HttpException(400, {
        message: "Metadata is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input.metadata.documentType)) {
      throw new HttpException(400, {
        message: "metadata.documentType is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input.metadata.projectName)) {
      throw new HttpException(400, {
        message: "metadata.projectName is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input.metadata.domain)) {
      throw new HttpException(400, {
        message: "metadata.domain is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input.metadata.regionId)) {
      throw new HttpException(400, {
        message: "metadata.regionId is required",
        result: false,
      });
    }

    if (!input?.version) {
      throw new HttpException(400, {
        message: "Version is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input.version.fileName)) {
      throw new HttpException(400, {
        message: "version.fileName is required",
        result: false,
      });
    }

    if (!isNonEmptyString(input.version.fileUrl)) {
      throw new HttpException(400, {
        message: "version.fileUrl is required",
        result: false,
      });
    }

    if (
      typeof input.version.fileSize !== "number" ||
      !Number.isFinite(input.version.fileSize) ||
      input.version.fileSize <= 0
    ) {
      throw new HttpException(400, {
        message: "version.fileSize must be a positive number",
        result: false,
      });
    }

    if (
      input.version.versionNo !== undefined &&
      (!Number.isInteger(input.version.versionNo) ||
        input.version.versionNo < 1)
    ) {
      throw new HttpException(400, {
        message: "version.versionNo must be a positive integer",
        result: false,
      });
    }

    await validateUserById([input.uploadedById]);

    const { resource, metadata, version } = await createKnowledgeUpload(input);

    return {
      message: "Knowledge upload successful",
      result: true,
      data: {
        resource,
        metadata,
        version,
      },
    };
  } catch (error: any) {
    logger.error(`Upload knowledge error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, {
      message: "Server error",
      result: false,
      error: { error },
    });
  }
};

const parseTags = (value?: string | null): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string");
      }
    } catch (error) {
      return [value];
    }
  }

  return [];
};

const buildAuthor = (user?: User | null) => {
  if (!user) {
    return null;
  }

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return {
    id: user.id,
    name: name || user.email,
    profilePicture: null,
  };
};

const buildKnowledgeResponse = (
  resource: KnowledgeResource,
  metadata?: KnowledgeMetadata | null,
  version?: KnowledgeVersion | null
) => {
  const tags = parseTags(metadata?.tags ?? null);

  return {
    id: resource.id,
    title: resource.title,
    description: resource.description ?? "",
    content: resource.content ?? "",
    category: resource.category ?? metadata?.domain ?? null,
    status: resource.status,
    region: metadata?.regionId?.name ?? null,
    regionId: metadata?.regionId?.id ?? null,
    author: buildAuthor(resource.uploadedBy),
    rating: resource.rating ?? 0,
    ratingCount: resource.ratingCount ?? 0,
    views: resource.views ?? 0,
    publishedAt: resource.publishedAt
      ? resource.publishedAt.toISOString()
      : null,
    hasPersonalData: resource.hasPersonalData ?? false,
    hasClientInfo: resource.hasClientInfo ?? false,
    metadata: metadata
      ? {
          documentType: metadata.documentType,
          projectName: metadata.projectName,
          domain: metadata.domain,
          tags,
        }
      : null,
    version: version
      ? {
          fileName: version.fileName,
          fileUrl: version.fileUrl,
          fileSize: version.fileSize,
          versionNo: version.versionNo,
        }
      : null,
  };
};

const applyKnowledgeFilters = (items: any[], filters: any) => {
  let filtered = items;

  if (filters?.category) {
    filtered = filtered.filter((item) => item.category === filters.category);
  }

  if (filters?.region) {
    filtered = filtered.filter((item) => item.regionId === filters.region);
  }

  if (filters?.minRating) {
    filtered = filtered.filter(
      (item) => (item.rating || 0) >= Number(filters.minRating)
    );
  }

  if (filters?.status) {
    filtered = filtered.filter((item) => item.status === filters.status);
  }

  return filtered;
};

export const getKnowledgeList = async (
  filters: any = {},
  userId?: string | null
) => {
  try {
    let resources = await getKnowledgeResourcesWithUploader();

    if (filters?.mine) {
      if (!userId) {
        throw new HttpException(401, {
          message: "Unauthorized",
          result: false,
        });
      }
      resources = resources.filter(
        (resource) => resource.uploadedBy?.id === userId
      );
    } else if (!filters?.status) {
      resources = resources.filter(
        (resource) => resource.status === KnowledgeResourceStatus.PUBLISHED
      );
    }

    const resourceIds = resources.map((resource) => resource.id);
    const { metadataMap, versionMap } = await getMetadataAndVersions(
      resourceIds
    );

    let items = resources.map((resource) =>
      buildKnowledgeResponse(
        resource,
        metadataMap.get(resource.id) ?? null,
        versionMap.get(resource.id) ?? null
      )
    );

    items = applyKnowledgeFilters(items, filters);

    if (filters?.limit) {
      const limit = Number(filters.limit);
      if (Number.isFinite(limit) && limit > 0) {
        items = items.slice(0, limit);
      }
    }

    return items;
  } catch (error: any) {
    logger.error(`Get knowledge list error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const getPublishedKnowledgeResources = async () => {
  try {
    return await getPublishedKnowledgeResourcesFromRepo();
  } catch (error: any) {
    logger.error(`Get published knowledge resources error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const getKnowledgeById = async (id: string) => {
  try {
    const resource = await getKnowledgeResourceByIdWithUploader(id);

    if (!resource) {
      throw new HttpException(404, {
        message: "Knowledge not found",
        result: false,
      });
    }

    resource.views = (resource.views ?? 0) + 1;
    await saveKnowledgeResource(resource);

    const { metadataMap, versionMap } = await getMetadataAndVersions([
      resource.id,
    ]);

    return buildKnowledgeResponse(
      resource,
      metadataMap.get(resource.id) ?? null,
      versionMap.get(resource.id) ?? null
    );
  } catch (error: any) {
    logger.error(`Get knowledge by id error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const updateKnowledgeById = async (id: string, payload: any) => {
  try {
    const resource = await getKnowledgeResourceById(id);

    if (!resource) {
      throw new HttpException(404, {
        message: "Knowledge not found",
        result: false,
      });
    }

    if (isNonEmptyString(payload?.title)) {
      resource.title = payload.title.trim();
    }

    if (payload?.description !== undefined) {
      resource.description = payload.description;
    }

    if (payload?.content !== undefined) {
      resource.content = payload.content;
    }

    if (payload?.category !== undefined) {
      resource.category = payload.category;
    }

    await saveKnowledgeResource(resource);
    return { message: "Knowledge updated", result: true };
  } catch (error: any) {
    logger.error(`Update knowledge error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const deleteKnowledgeById = async (id: string) => {
  try {
    const resource = await getKnowledgeResourceById(id);

    if (!resource) {
      throw new HttpException(404, {
        message: "Knowledge not found",
        result: false,
      });
    }

    await removeKnowledgeResource(resource);
    return { message: "Knowledge deleted", result: true };
  } catch (error: any) {
    logger.error(`Delete knowledge error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const searchKnowledge = async (query: string, filters: any = {}) => {
  const results = await getKnowledgeList({
    ...filters,
    status: filters?.status,
  });
  if (!query) {
    return results;
  }

  const needle = query.toLowerCase();
  return results.filter((item) => {
    const content = [
      item.title,
      item.description,
      item.content,
      item.category,
      item.metadata?.documentType,
      item.metadata?.projectName,
      item.metadata?.domain,
      ...(item.metadata?.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return content.includes(needle);
  });
};

export const rateKnowledge = async (id: string, rating: number) => {
  try {
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new HttpException(400, {
        message: "Rating must be between 1 and 5",
      });
    }

    const resource = await getKnowledgeResourceById(id);

    if (!resource) {
      throw new HttpException(404, {
        message: "Knowledge not found",
        result: false,
      });
    }

    const currentCount = resource.ratingCount ?? 0;
    const currentRating = resource.rating ?? 0;
    const newCount = currentCount + 1;
    const newRating = (currentRating * currentCount + rating) / newCount;

    resource.ratingCount = newCount;
    resource.rating = Number(newRating.toFixed(2));
    await saveKnowledgeResource(resource);

    return {
      message: "Rating submitted",
      result: true,
      rating: resource.rating,
    };
  } catch (error: any) {
    logger.error(`Rate knowledge error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const saveFavorite = async () => {
  return { message: "Favorite saved", result: true };
};

export const getTrendingKnowledge = async (period?: string) => {
  const items = await getKnowledgeList({
    status: KnowledgeResourceStatus.PUBLISHED,
  });
  const sorted = [...items].sort((a, b) => (b.views || 0) - (a.views || 0));

  if (period) {
    return sorted;
  }

  return sorted;
};

export const getRecommendations = async () => {
  const items = await getKnowledgeList({
    status: KnowledgeResourceStatus.PUBLISHED,
  });
  const sorted = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return sorted.slice(0, 6);
};
