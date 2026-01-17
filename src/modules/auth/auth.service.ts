import dotenv from "dotenv";

import { AuthResult, LoginInput, SignupInput } from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";
import logger from "../../util/logger";
import {
  createUserEntry,
  getRoleByIdEntry,
  getUserByEmailEntry,
} from "../users/user.service";
import { getRegionByIdEntry } from "../geo-location/geo-location.service";

dotenv.config();

export const signup = async (
  registerUser: SignupInput
): Promise<AuthResult> => {
  try {
    logger.info("Signup attempt");

    const { roleId, regionId, ...userInput } = registerUser || {};

    if (!roleId || typeof roleId !== "string") {
      throw new HttpException(400, {
        message: "Role id is required",
        result: false,
      });
    }

    if (!regionId || typeof regionId !== "string") {
      throw new HttpException(400, {
        message: "Region id is required",
        result: false,
      });
    }

    const role = await getRoleByIdEntry(roleId);
    if (!role) {
      throw new HttpException(404, {
        message: `Role not found for id: ${roleId}`,
        result: false,
      });
    }

    const region = await getRegionByIdEntry(regionId);
    if (!region) {
      throw new HttpException(404, {
        message: `Region not found for id: ${regionId}`,
        result: false,
      });
    }

    const newUser = await createUserEntry({ ...userInput, role, region });
    if (!newUser) {
      throw new HttpException(500, {
        message: "Failed to create user",
        result: false,
      });
    }

    logger.info(`User created: ${newUser.id}`);

    const token = encrypt.generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    logger.info(`Token generated for signup: ${newUser.id}`);

    return {
      message: "Signup successful",
      result: true,
      data: {
        user: {
          userId: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    logger.error(`Signup error: ${error.message}`);

    if (
      error?.code === "SQLITE_CONSTRAINT" ||
      `${error?.message || ""}`.includes("UNIQUE constraint failed")
    ) {
      throw new HttpException(409, {
        message: "Email already exist",
        result: false,
        data: {
          accessToken: null,
        },
        error: { errmsg: error.message },
      });
    } else {
      throw new HttpException(500, {
        message: "Server error",
        error: { error },
      });
    }
  }
};

export const login = async (loginInput: LoginInput): Promise<AuthResult> => {
  try {
    logger.info("Login attempt");

    const user: any = await getUserByEmailEntry(loginInput.email);
    if (!user) {
      logger.warn("Login failed: user not found");
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }

    const isMatch = await encrypt.verifyPassword(
      user.password,
      loginInput.password
    );

    if (!isMatch) {
      logger.warn(`Login failed: password mismatch for userId ${user.id}`);
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }

    const token = encrypt.generateToken({
      userId: user.id,
      email: user.email,
    });

    logger.info(`Login successful: ${user.id}`);

    return {
      message: "Login successful",
      result: true,
      data: {
        user: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};
