import "reflect-metadata";
import dotenv from "dotenv";
import { app } from "./app";
import initializeDatabase from "./config/db";
import logger from "./util/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to start server due to database error:", error);
    process.exit(1);
  });
