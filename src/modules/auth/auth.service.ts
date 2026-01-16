import dotenv from "dotenv";

import { createUser, getUserByEmail } from "../users/user.repository";
import { IUser } from "../users/user.enity";
import { AuthResult, LoginInput } from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";
import logger from "../../util/logger";

dotenv.config();

export const signup = async (registerUser: IUser): Promise<AuthResult> => {
  try {
    logger.info("Signup attempt");

    const newUser = await createUser(registerUser);
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

    const user: any = await getUserByEmail(loginInput.email);
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
