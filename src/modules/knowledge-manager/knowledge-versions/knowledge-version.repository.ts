import { In } from "typeorm";
import { AppDataSource } from "../../../config/db";
import HttpException from "../../../util/http-exception.model";
import logger from "../../../util/logger";
import { KnowledgeVersion } from "./models/knowledge-version.model";
import { IKnowledgeVersion } from "./models/knowledge-version.interface";
import { KnowledgeResource } from "../knowledge-resources/models/knowledge-resource.model";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (id: string) => uuidRegex.test(id);

export const saveKnowledgeVersion = async (
  knowledgeResourceId: string,
  newKnowledgeVersion: IKnowledgeVersion
) => {
  try {
    logger.info(
      `Saving knowledge version for resource ID: ${knowledgeResourceId}`
    );

    const versionRepository = AppDataSource.getRepository(KnowledgeVersion);
    const version = versionRepository.create({
      ...newKnowledgeVersion,
      knowledge_resource_id: { id: knowledgeResourceId } as KnowledgeResource,
    });
    await versionRepository.save(version);

    logger.info(`Knowledge version saved: ID ${version.id}`);
    return version;
  } catch (error: any) {
    logger.error(
      `Error saving knowledge version for resource ${knowledgeResourceId}: ${error.message}`
    );
    throw error;
  }
};

export const getKnowledgeVersionById = async (
  id: string
): Promise<IKnowledgeVersion | null> => {
  try {
    await validateKnowledgeVersionById([id]);

    const versionRepository = AppDataSource.getRepository(KnowledgeVersion);
    return await versionRepository.findOne({ where: { id } });
  } catch (error: any) {
    logger.error(
      `Error fetching knowledge version ID: ${id}, error: ${error.message}`
    );
    throw error;
  }
};

export const retrieveVersionsByResourceId = async (
  knowledgeResourceId: string
) => {
  try {
    const versionRepository = AppDataSource.getRepository(KnowledgeVersion);
    const versions = await versionRepository.find({
      where: { knowledge_resource_id: { id: knowledgeResourceId } },
    });

    logger.info(
      `Knowledge versions fetched for resource ${knowledgeResourceId}: count = ${versions.length}`
    );
    return versions;
  } catch (error: any) {
    logger.error(
      `Error fetching knowledge versions for resource ${knowledgeResourceId}: ${error.message}`
    );
    throw error;
  }
};

export const updateKnowledgeVersion = async (
  versionId: string,
  updateVersion: IKnowledgeVersion
) => {
  try {
    logger.info(`Updating knowledge version: ${versionId}`);

    const versionRepository = AppDataSource.getRepository(KnowledgeVersion);
    await versionRepository.update(versionId, updateVersion);

    const updatedVersion = await versionRepository.findOne({
      where: { id: versionId },
    });

    if (!updatedVersion) {
      logger.warn(`Knowledge version ${versionId} not found for update`);
      throw new Error(`Knowledge version with ID ${versionId} not found.`);
    }

    logger.info(`Knowledge version updated successfully: ${versionId}`);
    return updatedVersion;
  } catch (error: any) {
    logger.error(
      `Error updating knowledge version ID: ${versionId}, error: ${error.message}`
    );
    throw error;
  }
};

export const deleteKnowledgeVersion = async (id: string) => {
  try {
    logger.info(`Deleting knowledge version ID: ${id}`);

    const versionRepository = AppDataSource.getRepository(KnowledgeVersion);
    const deletedVersion = await versionRepository.findOne({ where: { id } });
    if (!deletedVersion) {
      return null;
    }

    await versionRepository.remove(deletedVersion);

    return deletedVersion;
  } catch (error: any) {
    logger.error(
      `Error deleting knowledge version ID: ${id}, error: ${error.message}`
    );
    throw error;
  }
};

export const validateKnowledgeVersionById = async (
  id: string[]
): Promise<string[]> => {
  try {
    logger.info(`Validating knowledge version ID(s): ${id.join(", ")}`);

    const invalidIds = id.filter((value) => !isUuid(value));

    if (invalidIds.length > 0) {
      logger.warn(`Invalid UUID(s): ${invalidIds.join(", ")}`);
      throw new HttpException(202, {
        message: `Invalid UUID(s): ${invalidIds.join(", ")}`,
        result: false,
      });
    }

    const versionRepository = AppDataSource.getRepository(KnowledgeVersion);
    const data: Array<{ id: string }> = await versionRepository.find({
      where: { id: In(id) },
      select: { id: true },
    });

    if (!data.length) {
      logger.warn(
        `No valid knowledge versions found for ID(s): ${id.join(", ")}`
      );
      throw new HttpException(202, {
        message: "No valid knowledge versions found",
        result: false,
      });
    }

    logger.info(
      `Validated knowledge version ID(s): ${data.map((version) => version.id).join(", ")}`
    );
    return data.map((version) => version.id);
  } catch (error: any) {
    logger.error(
      `Validation error for knowledge version ID(s): ${id.join(
        ", "
      )}, error: ${error.message}`
    );
    throw error;
  }
};
