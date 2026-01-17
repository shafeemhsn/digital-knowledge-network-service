import { AppDataSource } from "../../config/db";
import { User } from "../users/entity/user.enity";
import { validateUserById } from "../users/user.service";
import {
  createKnowledgeResource,
  createKnowledgeMetadata,
  createKnowledgeVersion,
} from "./knowledge-manager.repository";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";

export interface KnowledgeUploadInput {
  title: string;
  description?: string | null;
  uploadedById: string;
  metadata: {
    documentType: string;
    projectName: string;
    domain: string;
    tags?: string[] | string | null;
  };
  version: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    versionNo?: number;
  };
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

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

export const uploadKnowledge = async (input: KnowledgeUploadInput) => {
  try {
    logger.info("Uploading knowledge resource");

    if (!isNonEmptyString(input?.title)) {
      throw new HttpException(400, {
        message: "Title is required",
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

      const resource = await createKnowledgeResource(
        manager,
        {
          title: input.title.trim(),
          description: input.description ?? null,
        },
        uploader
      );

      const metadata = await createKnowledgeMetadata(manager, {
        knowledgeResourceId: resource,
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

      return {
        message: "Knowledge upload successful",
        result: true,
        data: {
          resource,
          metadata,
          version,
        },
      };
    });
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
