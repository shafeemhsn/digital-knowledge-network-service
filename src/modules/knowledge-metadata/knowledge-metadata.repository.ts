import { In } from "typeorm";
import { AppDataSource } from "../../config/db";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { KnowledgeMetadata } from "./models/knowledge-metadata.model";
import { IKnowledgeMetadata } from "./models/knowledge-metadata.interface";
import { KnowledgeResource } from "../knowledge-resources/models/knowledge-resource.model";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (id: string) => uuidRegex.test(id);

export const saveKnowledgeMetadata = async (
  knowledgeResourceId: string,
  newKnowledgeMetadata: IKnowledgeMetadata
) => {
  try {
    logger.info(
      `Saving knowledge metadata for resource ID: ${knowledgeResourceId}`
    );

    const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
    const metadata = metadataRepository.create({
      ...newKnowledgeMetadata,
      knowledge_resource_id: { id: knowledgeResourceId } as KnowledgeResource,
    });
    await metadataRepository.save(metadata);

    logger.info(`Knowledge metadata saved: ID ${metadata.id}`);
    return metadata;
  } catch (error: any) {
    logger.error(
      `Error saving knowledge metadata for resource ${knowledgeResourceId}: ${error.message}`
    );
    throw error;
  }
};

export const getKnowledgeMetadataById = async (
  id: string
): Promise<IKnowledgeMetadata | null> => {
  try {
    await validateKnowledgeMetadataById([id]);

    const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
    return await metadataRepository.findOne({ where: { id } });
  } catch (error: any) {
    logger.error(
      `Error fetching knowledge metadata ID: ${id}, error: ${error.message}`
    );
    throw error;
  }
};

export const retrieveMetadataByResourceId = async (
  knowledgeResourceId: string
) => {
  try {
    const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
    const metadata = await metadataRepository.find({
      where: { knowledge_resource_id: { id: knowledgeResourceId } },
    });

    logger.info(
      `Knowledge metadata fetched for resource ${knowledgeResourceId}: count = ${metadata.length}`
    );
    return metadata;
  } catch (error: any) {
    logger.error(
      `Error fetching knowledge metadata for resource ${knowledgeResourceId}: ${error.message}`
    );
    throw error;
  }
};

export const updateKnowledgeMetadata = async (
  metadataId: string,
  updateMetadata: IKnowledgeMetadata
) => {
  try {
    logger.info(`Updating knowledge metadata: ${metadataId}`);

    const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
    await metadataRepository.update(metadataId, updateMetadata);

    const updatedMetadata = await metadataRepository.findOne({
      where: { id: metadataId },
    });

    if (!updatedMetadata) {
      logger.warn(`Knowledge metadata ${metadataId} not found for update`);
      throw new Error(`Knowledge metadata with ID ${metadataId} not found.`);
    }

    logger.info(`Knowledge metadata updated successfully: ${metadataId}`);
    return updatedMetadata;
  } catch (error: any) {
    logger.error(
      `Error updating knowledge metadata ID: ${metadataId}, error: ${error.message}`
    );
    throw error;
  }
};

export const deleteKnowledgeMetadata = async (id: string) => {
  try {
    logger.info(`Deleting knowledge metadata ID: ${id}`);

    const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
    const deletedMetadata = await metadataRepository.findOne({ where: { id } });
    if (!deletedMetadata) {
      return null;
    }

    await metadataRepository.remove(deletedMetadata);

    return deletedMetadata;
  } catch (error: any) {
    logger.error(
      `Error deleting knowledge metadata ID: ${id}, error: ${error.message}`
    );
    throw error;
  }
};

export const validateKnowledgeMetadataById = async (
  id: string[]
): Promise<string[]> => {
  try {
    logger.info(`Validating knowledge metadata ID(s): ${id.join(", ")}`);

    const invalidIds = id.filter((value) => !isUuid(value));

    if (invalidIds.length > 0) {
      logger.warn(`Invalid UUID(s): ${invalidIds.join(", ")}`);
      throw new HttpException(202, {
        message: `Invalid UUID(s): ${invalidIds.join(", ")}`,
        result: false,
      });
    }

    const metadataRepository = AppDataSource.getRepository(KnowledgeMetadata);
    const data = await metadataRepository.find({
      where: { id: In(id) },
      select: { id: true },
    });

    if (!data.length) {
      logger.warn(
        `No valid knowledge metadata found for ID(s): ${id.join(", ")}`
      );
      throw new HttpException(202, {
        message: "No valid knowledge metadata found",
        result: false,
      });
    }

    logger.info(
      `Validated knowledge metadata ID(s): ${data.map((u) => u.id).join(", ")}`
    );
    return data.map((obj) => obj.id);
  } catch (error: any) {
    logger.error(
      `Validation error for knowledge metadata ID(s): ${id.join(
        ", "
      )}, error: ${error.message}`
    );
    throw error;
  }
};
