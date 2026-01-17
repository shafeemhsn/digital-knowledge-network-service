import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import {
  createOffice,
  createRegion,
  getAllRegions,
  getRegionById,
} from "./geo-location.repository";
import { IRegion } from "./entity/region.entity";
import {
  CreateOfficeInput,
  CreateRegionInput,
} from "./interface/geo-location.interface";

export const createRegionEntry = async (input: CreateRegionInput) => {
  try {
    const { id, name } = input || {};
    if (!id || typeof id !== "string") {
      throw new HttpException(400, {
        message: "Region id is required",
        result: false,
      });
    }

    if (!name || typeof name !== "string") {
      throw new HttpException(400, {
        message: "Region name is required",
        result: false,
      });
    }

    const region = await createRegion({ id, name });
    return {
      message: "Region created successfully",
      result: true,
      data: region,
    };
  } catch (error: any) {
    logger.error(`Create region error: ${error.message}`);
    throw error;
  }
};

export const createOfficeEntry = async (input: CreateOfficeInput) => {
  try {
    const { name, regionId } = input || {};

    if (!name || typeof name !== "string") {
      throw new HttpException(400, {
        message: "Office name is required",
        result: false,
      });
    }

    if (!regionId || typeof regionId !== "string") {
      throw new HttpException(400, {
        message: "Valid regionId is required",
        result: false,
      });
    }

    const region = await getRegionById(regionId);
    if (!region) {
      throw new HttpException(404, {
        message: `Region not found for id: ${regionId}`,
        result: false,
      });
    }

    const office = await createOffice({ name, region });
    return {
      message: "Office created successfully",
      result: true,
      data: office,
    };
  } catch (error: any) {
    logger.error(`Create office error: ${error.message}`);
    throw error;
  }
};

export const getRegionByIdEntry = async (
  id: string
): Promise<IRegion | null> => {
  try {
    logger.info(`Fetching region by ID: ${id}`);
    return await getRegionById(id);
  } catch (error: any) {
    logger.error(`Get region error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const getAllRegionsEntry = async (): Promise<IRegion[]> => {
  try {
    logger.info("Fetching all regions");
    return await getAllRegions();
  } catch (error: any) {
    logger.error(`Get regions error: ${error.message}`);
    throw error;
  }
};
