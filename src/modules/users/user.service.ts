import HttpException from "../../util/http-exception.model";
import { In } from "typeorm";
import { IUser, User } from "./entity/user.enity";
import { RoleName } from "./role-permission.enums";
import { AppDataSource } from "../../config/db";
import {
  createRole,
  createUser,
  deleteUser,
  getRoleById,
  getUserByEmail,
  updateUser,
} from "./user.repository";
import logger from "../../util/logger";
import { IRole } from "./entity/role.enity";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (id: string) => uuidRegex.test(id);

export const updateUserDetails = async (id: string, updateUserData: IUser) => {
  try {
    logger.info(`Attempting to update user: ${id}`);

    const updatedUser = await updateUser(id, updateUserData);
    if (!updatedUser) {
      logger.error(`Failed to update user with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error updating user with ID: ${id}`,
        result: false,
      });
    }

    logger.info(`User updated successfully: ${id}`);
    return updatedUser;
  } catch (error: any) {
    logger.error(`Update user error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    logger.info(`Attempting to delete user: ${id}`);

    const user = await getUserById(id);
    if (user === null) {
      logger.warn(`User not found for deletion: ${id}`);
      throw new HttpException(202, {
        message: `User ID : ${id} does not exist`,
      });
    }

    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      logger.error(`Failed to delete user with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error in deleting user ID: ${id}`,
        result: false,
      });
    }

    logger.info(`User deleted: ID: ${deletedUser.id}`);

    return {
      message: `User successfully deleted: ID: ${deletedUser.id}, email: ${deletedUser.email}`,
    };
  } catch (error: any) {
    logger.error(`Delete user error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    logger.info(`Fetching user by ID: ${id}`);

    await validateUserById([id]);

    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({
      where: { id },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  } catch (error) {
    logger.error(`Error in getUserById (ID: ${id}): ${JSON.stringify(error)}`);
    throw error;
  }
};

export const validateUser = async (id: string[]): Promise<string[] | any> => {
  const validatedData = await validateUserById(id);

  if (!validatedData || validatedData.length === 0) {
    logger.warn(`User ID not found: ${id}`);
    throw new HttpException(202, {
      message: `UserId not found - ID: ${id}`,
    });
  }

  return validatedData;
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
      logger.warn("No users found by provided ID(s)");
      throw new HttpException(202, {
        message: "No valid users found",
        result: false,
      });
    }

    logger.info(
      `Validated user ID(s): ${users.map((user) => user.id).join(", ")}`
    );
    return users.map((user) => user.id);
  } catch (error) {
    logger.error(
      `Validation error for ID(s): ${id.join(", ")} - ${JSON.stringify(error)}`
    );
    throw error;
  }
};

export const createRoleEntry = async (id: string, name: string) => {
  try {
    logger.info(`Attempting to create role: ${id}`);

    if (!id || typeof id !== "string") {
      throw new HttpException(400, {
        message: "Role id is required",
        result: false,
      });
    }

    const roleName = name as RoleName;
    if (!Object.values(RoleName).includes(roleName)) {
      throw new HttpException(400, {
        message: `Invalid role name: ${name}`,
        result: false,
      });
    }

    const role = await createRole({ id, name: roleName });

    logger.info(`Role created successfully: ${role.id}`);
    return {
      message: "Role created successfully",
      result: true,
      data: role,
    };
  } catch (error: any) {
    logger.error(`Create role error: ${error.message}`);
    throw error;
  }
};

export const getRoleByIdEntry = async (id: string): Promise<IRole | null> => {
  try {
    logger.info(`Fetching role by ID: ${id}`);
    return await getRoleById(id);
  } catch (error: any) {
    logger.error(`Get role error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const createUserEntry = async (userInput: Partial<IUser>) => {
  try {
    logger.info("Creating user via user service");
    return await createUser(userInput);
  } catch (error: any) {
    logger.error(`Create user error: ${error.message}`);
    throw error;
  }
};

export const getUserByEmailEntry = async (
  email: string
): Promise<IUser | null> => {
  try {
    logger.info(`Fetching user by email: ${email}`);
    return await getUserByEmail(email);
  } catch (error: any) {
    logger.error(`Get user by email error: ${error.message}`);
    throw error;
  }
};
