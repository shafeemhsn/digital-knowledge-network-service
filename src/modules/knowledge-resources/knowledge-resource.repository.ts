import { In } from "typeorm";
import { AppDataSource } from "../../config/db";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { KnowledgeResource } from "./models/knowledge-resource.model";
import { IKnowledgeResource } from "./models/knowledge-resource.interface";
import { User } from "../users/models/user.model";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (id: string) => uuidRegex.test(id);

export const saveKnowledgeResource = async (
  userId: string,
  newKnowledgeResource: IKnowledgeResource
) => {
  try {
    logger.info(`Saving knowledge resource for user ID: ${userId}`);

    const resourceRepository = AppDataSource.getRepository(KnowledgeResource);
    const resource = resourceRepository.create({
      ...newKnowledgeResource,
      uploaded_by: { id: userId } as User,
    });
    await resourceRepository.save(resource);

    logger.info(`Knowledge resource saved: ID ${resource.id}`);
    return resource;
  } catch (error: any) {
    logger.error(
      `Error saving knowledge resource for user ${userId}: ${error.message}`
    );
    throw error;
  }
};

export const getKnowledgeResourceById = async (
  id: string
): Promise<IKnowledgeResource | null> => {
  try {
    await validateKnowledgeResourceById([id]);

    const resourceRepository = AppDataSource.getRepository(KnowledgeResource);
    return await resourceRepository.findOne({ where: { id } });
  } catch (error: any) {
    logger.error(
      `Error fetching knowledge resource ID: ${id}, error: ${error.message}`
    );
    throw error;
  }
};

export const retrieveKnowledgeResourcesByUserId = async (userId: string) => {
  try {
    const resourceRepository = AppDataSource.getRepository(KnowledgeResource);
    const resources = await resourceRepository.find({
      where: { uploaded_by: { id: userId } },
    });

    logger.info(
      `Knowledge resources fetched for user ${userId}: count = ${resources.length}`
    );
    return resources;
  } catch (error: any) {
    logger.error(
      `Error fetching knowledge resources for user ${userId}: ${error.message}`
    );
    throw error;
  }
};

export const updateKnowledgeResource = async (
  resourceId: string,
  updateResource: IKnowledgeResource
) => {
  try {
    logger.info(`Updating knowledge resource: ${resourceId}`);

    const resourceRepository = AppDataSource.getRepository(KnowledgeResource);
    await resourceRepository.update(resourceId, updateResource);

    const updatedResource = await resourceRepository.findOne({
      where: { id: resourceId },
    });

    if (!updatedResource) {
      logger.warn(`Knowledge resource ${resourceId} not found for update`);
      throw new Error(`Knowledge resource with ID ${resourceId} not found.`);
    }

    logger.info(`Knowledge resource updated successfully: ${resourceId}`);
    return updatedResource;
  } catch (error: any) {
    logger.error(
      `Error updating knowledge resource ID: ${resourceId}, error: ${error.message}`
    );
    throw error;
  }
};

export const deleteKnowledgeResource = async (id: string) => {
  try {
    logger.info(`Deleting knowledge resource ID: ${id}`);

    const resourceRepository = AppDataSource.getRepository(KnowledgeResource);
    const deletedResource = await resourceRepository.findOne({ where: { id } });
    if (!deletedResource) {
      return null;
    }

    await resourceRepository.remove(deletedResource);

    return deletedResource;
  } catch (error: any) {
    logger.error(
      `Error deleting knowledge resource ID: ${id}, error: ${error.message}`
    );
    throw error;
  }
};

export const validateKnowledgeResourceById = async (
  id: string[]
): Promise<string[]> => {
  try {
    logger.info(`Validating knowledge resource ID(s): ${id.join(", ")}`);

    const invalidIds = id.filter((value) => !isUuid(value));

    if (invalidIds.length > 0) {
      logger.warn(`Invalid UUID(s): ${invalidIds.join(", ")}`);
      throw new HttpException(202, {
        message: `Invalid UUID(s): ${invalidIds.join(", ")}`,
        result: false,
      });
    }

    const resourceRepository = AppDataSource.getRepository(KnowledgeResource);
    const data = await resourceRepository.find({
      where: { id: In(id) },
      select: { id: true },
    });

    if (!data.length) {
      logger.warn(
        `No valid knowledge resources found for ID(s): ${id.join(", ")}`
      );
      throw new HttpException(202, {
        message: "No valid knowledge resources found",
        result: false,
      });
    }

    logger.info(
      `Validated knowledge resource ID(s): ${data.map((u) => u.id).join(", ")}`
    );
    return data.map((obj) => obj.id);
  } catch (error: any) {
    logger.error(
      `Validation error for knowledge resource ID(s): ${id.join(
        ", "
      )}, error: ${error.message}`
    );
    throw error;
  }
};
