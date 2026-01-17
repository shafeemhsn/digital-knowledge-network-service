import { Request } from "express";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";
import { JwtPayload } from "./interface/auth.interface";

export const getAuthPayload = (req: Request): JwtPayload | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return null;
  }

  try {
    return encrypt.verifyToken(token);
  } catch (error) {
    throw new HttpException(401, { message: "Invalid token", result: false });
  }
};
