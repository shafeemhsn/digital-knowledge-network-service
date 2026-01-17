import { Router } from "express";
import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { knowledgeManagerController } from "./modules/knowledge-manager/knowledge-manager.controller";
import { geoLocationController } from "./modules/geo-location/geo-location.controller";
import {
  complianceController,
  governanceController,
} from "./modules/governance-manager/governance-manager.controller";
import { expertsController } from "./modules/experts/experts.controller";
import { notificationsController } from "./modules/notifications/notifications.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/knowledge", knowledgeManagerController)
  .use("/geo-location", geoLocationController)
  .use("/compliance", complianceController)
  .use("/governance", governanceController)
  .use("/experts", expertsController)
  .use("/notifications", notificationsController);

export default Router().use(routes);
