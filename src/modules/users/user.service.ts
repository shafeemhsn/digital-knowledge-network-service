import HttpException from "../../util/http-exception.model";
import { IUser } from "./entity/user.enity";
import { RoleName } from "./role-permission.enums";
import {
  createRole,
  createUser,
  deleteUser,
  getRoleById,
  getUserById as getUserByIdRepo,
  getUserByIdWithRelations,
  getUsersWithRelations,
  getUserByEmail,
  updateUser,
  validateUserById as validateUserByIdRepo,
} from "./user.repository";
import logger from "../../util/logger";
import { IRole } from "./entity/role.enity";

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
    return await getUserByIdRepo(id);
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
    return await validateUserByIdRepo(id);
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

export const getUserByIdWithRelationsEntry = async (
  id: string
): Promise<IUser | null> => {
  try {
    logger.info(`Fetching user by ID with relations: ${id}`);
    return await getUserByIdWithRelations(id);
  } catch (error: any) {
    logger.error(`Get user by id error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const getUsersWithRelationsEntry = async (): Promise<IUser[]> => {
  try {
    logger.info("Fetching users with relations");
    return await getUsersWithRelations();
  } catch (error: any) {
    logger.error(`Get users with relations error: ${error.message}`);
    throw error;
  }
};
