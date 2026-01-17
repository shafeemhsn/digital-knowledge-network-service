import { IUser } from "../../users/entity/user.enity";

export interface AuthUserResponse {
  id: string;
  email: string;
  name: string;
  role: string | null;
  region: string | null;
  expertise?: string;
  contributionScore?: number;
}

export interface AuthResult {
  token: string;
  user: AuthUserResponse;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId?: string | any;
  email: string;
}

export type SignupInput = Partial<IUser> & {
  roleId?: string;
  regionId?: string;
};
