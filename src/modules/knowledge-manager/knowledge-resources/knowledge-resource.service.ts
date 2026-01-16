import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { validateUser } from "../users/user.service";
import { IKnowledgeResource } from "./models/knowledge-resource.interface";
import {
  deleteKnowledgeResource,
  getKnowledgeResourceById,
  retrieveKnowledgeResourcesByUserId,
  saveKnowledgeResource,
  updateKnowledgeResource,
} from "./knowledge-resource.repository";

export const createKnowledgeResource = async (
  userId: string,
  newKnowledgeResource: IKnowledgeResource
) => {
  try {
    logger.info(`Creating knowledge resource for user: ${userId}`);
    await validateUser([userId]);

    const resource = await saveKnowledgeResource(userId, newKnowledgeResource);
    if (!resource) {
      logger.error(`Failed to create knowledge resource for user: ${userId}`);
      throw new HttpException(500, {
        message: "Error in creating knowledge resource.",
        result: false,
      });
    }

    return resource;
  } catch (error: any) {
    logger.error(
      `Error creating knowledge resource for user ${userId}: ${error.message}`
    );
    throw error;
  }
};

export const getKnowledgeResourcesByUserId = async (id: string) => {
  try {
    logger.info(`Retrieving knowledge resources for user: ${id}`);
    await validateUser([id]);

    const data = await retrieveKnowledgeResourcesByUserId(id);
    if (!data) {
      logger.error(`Failed to retrieve knowledge resources for user: ${id}`);
      throw new HttpException(500, {
        message: `Error occurred when retrieving knowledge resources by userId: ${id}`,
        result: false,
      });
    }

    return data;
  } catch (error: any) {
    logger.error(
      `Error retrieving knowledge resources for user ${id}: ${error.message}`
    );
    throw error;
  }
};

export const updateKnowledgeResourceDetails = async (
  id: string,
  updateResourceData: IKnowledgeResource
) => {
  const resource = await getKnowledgeResourceById(id);
  if (resource === null) {
    logger.warn(`Knowledge resource not found for update: ${id}`);
    throw new HttpException(202, {
      message: `Knowledge resource ID : ${id} does not exist`,
    });
  }

  try {
    const updatedResource = await updateKnowledgeResource(id, updateResourceData);
    if (!updatedResource) {
      logger.error(`Failed to update knowledge resource: ${id}`);
      throw new HttpException(500, {
        message: `Error updating knowledge resource with ID: ${id}`,
        result: false,
      });
    }

    return updatedResource;
  } catch (error: any) {
    logger.error(`Error updating knowledge resource ${id}: ${error.message}`);
    throw error;
  }
};

export const deleteKnowledgeResourceById = async (id: string) => {
  try {
    const resource = await getKnowledgeResourceById(id);
    if (resource === null) {
      logger.warn(`Knowledge resource not found for deletion: ${id}`);
      throw new HttpException(202, {
        message: `Knowledge resource ID : ${id} does not exist`,
      });
    }

    const deletedResource = await deleteKnowledgeResource(id);
    if (!deletedResource) {
      logger.error(`Failed to delete knowledge resource with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error in deleting knowledge resource ID: ${id}`,
        result: false,
      });
    }

    logger.info(`Knowledge resource deleted successfully: ID: ${deletedResource.id}`);
    return deletedResource;
  } catch (error: any) {
    logger.error(
      `Delete knowledge resource error (ID: ${id}): ${error.message}`
    );
    throw error;
  }
};
