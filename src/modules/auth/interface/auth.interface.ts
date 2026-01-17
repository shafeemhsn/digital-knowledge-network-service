import { IUser } from "../../users/entity/user.enity";

export interface AuthResult {
  message: string;
  result?: boolean;
  data?: {
    user?: {
      userId: any;
      firstName: string;
      lastName: string;
      email: string;
    };
    accessToken: string;
  };
  error?: Object;
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
