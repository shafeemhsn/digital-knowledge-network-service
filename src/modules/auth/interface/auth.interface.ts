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
