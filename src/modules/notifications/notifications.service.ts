import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { getUserById } from "../users/user.service";
import {
  createNotificationForUser,
  getNotificationByIdForUser,
  getNotificationsByUserId,
  saveNotification,
} from "./notifications.repository";

const formatErrorMessage = (error: any) =>
  typeof error?.message === "string"
    ? error.message
    : JSON.stringify(error?.message ?? error);

export const createNotification = async (
  userId: string,
  message: string,
  type?: string
) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return null;
    }

    return await createNotificationForUser(user, message, type);
  } catch (error: any) {
    logger.error(`Create notification error: ${formatErrorMessage(error)}`);
    return null;
  }
};

export const getNotificationsForUser = async (userId: string) => {
  try {
    const notifications = await getNotificationsByUserId(userId);

    return notifications.map((item) => ({
      id: item.id,
      message: item.message,
      title: item.message,
      type: item.type,
      read: item.read,
      createdAt: item.createdAt?.toISOString?.() ?? null,
    }));
  } catch (error: any) {
    logger.error(`Get notifications error: ${formatErrorMessage(error)}`);
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const markNotificationAsRead = async (userId: string, id: string) => {
  try {
    const notification = await getNotificationByIdForUser(userId, id);

    if (!notification) {
      throw new HttpException(404, { message: "Notification not found", result: false });
    }

    notification.read = true;
    await saveNotification(notification);
    return { message: "Notification updated", result: true };
  } catch (error: any) {
    logger.error(`Mark notification read error: ${formatErrorMessage(error)}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};
