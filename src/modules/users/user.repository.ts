import { In } from "typeorm";
import { AppDataSource } from "../../config/db";
import { IUser, User } from "./user.enity";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (id: string) => uuidRegex.test(id);

export const createUser = async (
  createUser: IUser
): Promise<IUser | undefined> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create(createUser);
    logger.info("Creating user");
    return await userRepository.save(newUser);
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    logger.info("Retrieving user by email");
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({ where: { email } });
  } catch (error: any) {
    logger.error(`Error retrieving user: ${error.message}`);
    throw error;
  }
};

export const updateUser = async (id: string, updateUser: IUser) => {
  try {
    logger.info(`Updating user: ${id}`);
    const userRepository = AppDataSource.getRepository(User);
    await validateUserById([id]);
    await userRepository.update(id, updateUser);

    const updatedUser = await userRepository.findOne({
      where: { id },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!updatedUser) {
      logger.warn(`User with ID ${id} not found for update`);
      throw new Error(`User with ID ${id} not found.`);
    }

    logger.info(`User updated successfully: ${id}`);
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user ID: ${id}, error: ${error}`);
    throw error;
  }
};

export const validateUserById = async (id: string[]): Promise<string[]> => {
  try {
    logger.info(`Validating user ID(s): ${id.join(", ")}`);

    const invalidIds = id.filter((value) => !isUuid(value));

    if (invalidIds.length > 0) {
      logger.warn(`Invalid UUID(s): ${invalidIds.join(", ")}`);
      throw new HttpException(202, {
        message: `Invalid UUID(s): ${invalidIds.join(", ")}`,
        result: false,
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      where: { id: In(id) },
      select: { id: true },
    });

    if (!users.length) {
      logger.warn(`No users found for ID(s): ${id.join(", ")}`);
      throw new HttpException(202, {
        message: "No valid users found",
        result: false,
      });
    }

    logger.info(`User ID(s) validated: ${users.map((u) => u.id).join(", ")}`);
    return users.map((user) => user.id);
  } catch (error) {
    logger.error(
      `Validation error for user ID(s): ${id.join(
        ", "
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    logger.info(`Deleting user ID: ${id}`);
    const userRepository = AppDataSource.getRepository(User);
    await validateUserById([id]);

    const deletedUser = await userRepository.findOne({ where: { id } });
    if (!deletedUser) {
      return null;
    }

    await userRepository.remove(deletedUser);

    return deletedUser;
  } catch (error) {
    logger.error(`Error deleting user ID: ${id}, error: ${error}`);
    throw error;
  }
};
