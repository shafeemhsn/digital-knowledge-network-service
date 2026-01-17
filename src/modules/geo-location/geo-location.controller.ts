import { Router, Request, Response, NextFunction } from "express";
import { createOfficeEntry, createRegionEntry } from "./geo-location.service";
import logger from "../../util/logger";
import {
  CreateOfficeInput,
  CreateRegionInput,
} from "./interface/geo-location.interface";

const router = Router();

router.post(
  "/regions",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /geo-location/regions - Create region request received");

    try {
      const result = await createRegionEntry(req.body as CreateRegionInput);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error(`Error creating region: ${error.message}`);
      next(error);
    }
  }
);

router.post(
  "/offices",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /geo-location/offices - Create office request received");

    try {
      const result = await createOfficeEntry(req.body as CreateOfficeInput);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error(`Error creating office: ${error.message}`);
      next(error);
    }
  }
);

export { router as geoLocationController };
