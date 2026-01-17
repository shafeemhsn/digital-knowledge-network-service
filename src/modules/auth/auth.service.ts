import dotenv from "dotenv";

import {
  AuthResult,
  AuthUserResponse,
  LoginInput,
  SignupInput,
} from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";
import logger from "../../util/logger";
import {
  createUserEntry,
  getRoleByIdEntry,
  getUserByIdWithRelationsEntry,
  getUserByEmailEntry,
} from "../users/user.service";
import { getRegionByIdEntry } from "../geo-location/geo-location.service";

dotenv.config();

const buildAuthUserResponse = (user: any): AuthUserResponse => {
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return {
    id: user.id,
    email: user.email,
    name,
    role: user?.role?.name ?? null,
    region: user?.region?.name ?? null,
    expertise: user?.expertise ?? "Generalist",
    contributionScore:
      typeof user?.contributionScore === "number" ? user.contributionScore : 0,
  };
};

const buildAuthResult = (token: string, user: any): AuthResult => ({
  token,
  user: buildAuthUserResponse(user),
});

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

    return buildAuthResult(token, { ...newUser, role, region });
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

    return buildAuthResult(token, user);
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};

export const getCurrentUser = async (token: string): Promise<AuthUserResponse> => {
  try {
    const payload = encrypt.verifyToken(token);
    if (!payload?.userId) {
      throw new HttpException(401, { message: "Invalid token", result: false });
    }

    const user = await getUserByIdWithRelationsEntry(payload.userId);
    if (!user) {
      throw new HttpException(404, { message: "User not found", result: false });
    }

    return buildAuthUserResponse(user);
  } catch (error: any) {
    logger.error(`Get current user error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(401, { message: "Unauthorized", result: false });
  }
};
