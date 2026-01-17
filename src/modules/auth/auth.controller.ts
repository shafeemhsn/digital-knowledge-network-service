import { Router, Request, Response, NextFunction } from "express";
import { getCurrentUser, login, signup } from "./auth.service";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST auth/signup called");

    try {
      const user = await signup({ ...req.body });
      res.status(201).json(user);
    } catch (error: any) {
      logger.error(`Signup error: ${error.message}`);
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST auth/login called");

    try {
      const result = await login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Login error: ${error.message}`);
      next(error);
    }
  }
);

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  logger.info("GET auth/me called");

  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new HttpException(401, { message: "Unauthorized", result: false });
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      throw new HttpException(401, { message: "Unauthorized", result: false });
    }

    const user = await getCurrentUser(token);
    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
});

export { router as authController };
