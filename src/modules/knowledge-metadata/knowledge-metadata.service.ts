import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { validateKnowledgeResourceById } from "../knowledge-resources/knowledge-resource.repository";
import { IKnowledgeMetadata } from "./models/knowledge-metadata.interface";
import {
  deleteKnowledgeMetadata,
  getKnowledgeMetadataById,
  retrieveMetadataByResourceId,
  saveKnowledgeMetadata,
  updateKnowledgeMetadata,
} from "./knowledge-metadata.repository";

export const createKnowledgeMetadata = async (
  knowledgeResourceId: string,
  newKnowledgeMetadata: IKnowledgeMetadata
) => {
  try {
    logger.info(
      `Creating knowledge metadata for resource: ${knowledgeResourceId}`
    );
    await validateKnowledgeResourceById([knowledgeResourceId]);

    const metadata = await saveKnowledgeMetadata(
      knowledgeResourceId,
      newKnowledgeMetadata
    );
    if (!metadata) {
      logger.error(
        `Failed to create knowledge metadata for resource: ${knowledgeResourceId}`
      );
      throw new HttpException(500, {
        message: "Error in creating knowledge metadata.",
        result: false,
      });
    }

    return metadata;
  } catch (error: any) {
    logger.error(
      `Error creating knowledge metadata for resource ${knowledgeResourceId}: ${error.message}`
    );
    throw error;
  }
};

export const getMetadataByResourceId = async (id: string) => {
  try {
    logger.info(`Retrieving knowledge metadata for resource: ${id}`);
    await validateKnowledgeResourceById([id]);

    const data = await retrieveMetadataByResourceId(id);
    if (!data) {
      logger.error(`Failed to retrieve knowledge metadata for resource: ${id}`);
      throw new HttpException(500, {
        message: `Error occurred when retrieving metadata by resourceId: ${id}`,
        result: false,
      });
    }

    return data;
  } catch (error: any) {
    logger.error(
      `Error retrieving knowledge metadata for resource ${id}: ${error.message}`
    );
    throw error;
  }
};

export const updateKnowledgeMetadataDetails = async (
  id: string,
  updateMetadataData: IKnowledgeMetadata
) => {
  const metadata = await getKnowledgeMetadataById(id);
  if (metadata === null) {
    logger.warn(`Knowledge metadata not found for update: ${id}`);
    throw new HttpException(202, {
      message: `Knowledge metadata ID : ${id} does not exist`,
    });
  }

  try {
    const updatedMetadata = await updateKnowledgeMetadata(
      id,
      updateMetadataData
    );
    if (!updatedMetadata) {
      logger.error(`Failed to update knowledge metadata: ${id}`);
      throw new HttpException(500, {
        message: `Error updating knowledge metadata with ID: ${id}`,
        result: false,
      });
    }

    return updatedMetadata;
  } catch (error: any) {
    logger.error(`Error updating knowledge metadata ${id}: ${error.message}`);
    throw error;
  }
};

export const deleteKnowledgeMetadataById = async (id: string) => {
  try {
    const metadata = await getKnowledgeMetadataById(id);
    if (metadata === null) {
      logger.warn(`Knowledge metadata not found for deletion: ${id}`);
      throw new HttpException(202, {
        message: `Knowledge metadata ID : ${id} does not exist`,
      });
    }

    const deletedMetadata = await deleteKnowledgeMetadata(id);
    if (!deletedMetadata) {
      logger.error(`Failed to delete knowledge metadata with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error in deleting knowledge metadata ID: ${id}`,
        result: false,
      });
    }

    logger.info(
      `Knowledge metadata deleted successfully: ID: ${deletedMetadata.id}`
    );
    return deletedMetadata;
  } catch (error: any) {
    logger.error(
      `Delete knowledge metadata error (ID: ${id}): ${error.message}`
    );
    throw error;
  }
};
