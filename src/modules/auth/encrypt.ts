import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { JwtPayload } from "./interface/auth.interface";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export class encrypt {
  static async verifyPassword(hashPassword: string, password: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  static generateToken(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}
