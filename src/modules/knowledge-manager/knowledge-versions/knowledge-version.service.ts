import HttpException from "../../../util/http-exception.model";
import logger from "../../../util/logger";
import { validateKnowledgeResourceById } from "../knowledge-resources/knowledge-resource.repository";
import { IKnowledgeVersion } from "./models/knowledge-version.interface";
import {
  deleteKnowledgeVersion,
  getKnowledgeVersionById,
  retrieveVersionsByResourceId,
  saveKnowledgeVersion,
  updateKnowledgeVersion,
} from "./knowledge-version.repository";

export const createKnowledgeVersion = async (
  knowledgeResourceId: string,
  newKnowledgeVersion: IKnowledgeVersion
) => {
  try {
    logger.info(`Creating knowledge version for resource: ${knowledgeResourceId}`);
    await validateKnowledgeResourceById([knowledgeResourceId]);

    const version = await saveKnowledgeVersion(
      knowledgeResourceId,
      newKnowledgeVersion
    );
    if (!version) {
      logger.error(
        `Failed to create knowledge version for resource: ${knowledgeResourceId}`
      );
      throw new HttpException(500, {
        message: "Error in creating knowledge version.",
        result: false,
      });
    }

    return version;
  } catch (error: any) {
    logger.error(
      `Error creating knowledge version for resource ${knowledgeResourceId}: ${error.message}`
    );
    throw error;
  }
};

export const getVersionsByResourceId = async (id: string) => {
  try {
    logger.info(`Retrieving knowledge versions for resource: ${id}`);
    await validateKnowledgeResourceById([id]);

    const data = await retrieveVersionsByResourceId(id);
    if (!data) {
      logger.error(`Failed to retrieve knowledge versions for resource: ${id}`);
      throw new HttpException(500, {
        message: `Error occurred when retrieving versions by resourceId: ${id}`,
        result: false,
      });
    }

    return data;
  } catch (error: any) {
    logger.error(
      `Error retrieving knowledge versions for resource ${id}: ${error.message}`
    );
    throw error;
  }
};

export const updateKnowledgeVersionDetails = async (
  id: string,
  updateVersionData: IKnowledgeVersion
) => {
  const version = await getKnowledgeVersionById(id);
  if (version === null) {
    logger.warn(`Knowledge version not found for update: ${id}`);
    throw new HttpException(202, {
      message: `Knowledge version ID : ${id} does not exist`,
    });
  }

  try {
    const updatedVersion = await updateKnowledgeVersion(id, updateVersionData);
    if (!updatedVersion) {
      logger.error(`Failed to update knowledge version: ${id}`);
      throw new HttpException(500, {
        message: `Error updating knowledge version with ID: ${id}`,
        result: false,
      });
    }

    return updatedVersion;
  } catch (error: any) {
    logger.error(`Error updating knowledge version ${id}: ${error.message}`);
    throw error;
  }
};

export const deleteKnowledgeVersionById = async (id: string) => {
  try {
    const version = await getKnowledgeVersionById(id);
    if (version === null) {
      logger.warn(`Knowledge version not found for deletion: ${id}`);
      throw new HttpException(202, {
        message: `Knowledge version ID : ${id} does not exist`,
      });
    }

    const deletedVersion = await deleteKnowledgeVersion(id);
    if (!deletedVersion) {
      logger.error(`Failed to delete knowledge version with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error in deleting knowledge version ID: ${id}`,
        result: false,
      });
    }

    logger.info(`Knowledge version deleted successfully: ID: ${deletedVersion.id}`);
    return deletedVersion;
  } catch (error: any) {
    logger.error(
      `Delete knowledge version error (ID: ${id}): ${error.message}`
    );
    throw error;
  }
};
