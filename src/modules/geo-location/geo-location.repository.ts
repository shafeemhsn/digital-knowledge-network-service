import { DeepPartial } from "typeorm";
import { AppDataSource } from "../../config/db";
import { Region, IRegion } from "./entity/region.entity";
import { Office, IOffice } from "./entity/office.entity";
import logger from "../../util/logger";

export const createRegion = async (
  createRegion: DeepPartial<IRegion>
): Promise<IRegion> => {
  try {
    const regionRepository = AppDataSource.getRepository(Region);
    const newRegion = regionRepository.create(createRegion);
    logger.info("Creating region");
    return await regionRepository.save(newRegion);
  } catch (error: any) {
    logger.error(`Error creating region: ${error.message}`);
    throw error;
  }
};

export const getRegionById = async (id: string): Promise<IRegion | null> => {
  try {
    const regionRepository = AppDataSource.getRepository(Region);
    return await regionRepository.findOne({ where: { id } });
  } catch (error: any) {
    logger.error(`Error fetching region by id: ${error.message}`);
    throw error;
  }
};

export const getAllRegions = async (): Promise<IRegion[]> => {
  try {
    const regionRepository = AppDataSource.getRepository(Region);
    return await regionRepository.find();
  } catch (error: any) {
    logger.error(`Error fetching regions: ${error.message}`);
    throw error;
  }
};

export const createOffice = async (
  createOffice: DeepPartial<IOffice>
): Promise<IOffice> => {
  try {
    const officeRepository = AppDataSource.getRepository(Office);
    const newOffice = officeRepository.create(createOffice);
    logger.info("Creating office");
    return await officeRepository.save(newOffice);
  } catch (error: any) {
    logger.error(`Error creating office: ${error.message}`);
    throw error;
  }
};
