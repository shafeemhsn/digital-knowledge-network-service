import { AppDataSource } from "../../config/db";
import logger from "../../util/logger";
import { IUser } from "../users/entity/user.enity";
import { getUserById } from "../users/user.service";
import { Notification } from "./entity/notification.entity";

export const createNotificationForUser = async (
  user: IUser,
  message: string,
  type?: string | null
) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    const notification = notificationRepository.create({
      user,
      message,
      type: type ?? null,
      read: false,
    });

    return await notificationRepository.save(notification);
  } catch (error: any) {
    logger.error(
      `Create notification repo error: ${formatErrorMessage(error)}`
    );
    throw error;
  }
};

export const getNotificationsByUserId = async (userId: string) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    return await notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });
  } catch (error: any) {
    logger.error(
      `Get notifications by user id repo error: ${formatErrorMessage(error)}`
    );
    throw error;
  }
};

export const getNotificationByIdForUser = async (
  userId: string,
  id: string
) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    return await notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
  } catch (error: any) {
    logger.error(
      `Get notification by id repo error: ${formatErrorMessage(error)}`
    );
    throw error;
  }
};

export const saveNotification = async (notification: Notification) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    return await notificationRepository.save(notification);
  } catch (error: any) {
    logger.error(`Save notification repo error: ${formatErrorMessage(error)}`);
    throw error;
  }
};

const formatErrorMessage = (error: any) =>
  typeof error?.message === "string"
    ? error.message
    : JSON.stringify(error?.message ?? error);
