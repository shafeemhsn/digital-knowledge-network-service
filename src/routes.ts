import { Router } from "express";
import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { knowledgeManagerController } from "./modules/knowledge-manager/knowledge-manager.controller";
import { geoLocationController } from "./modules/geo-location/geo-location.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/knowledge", knowledgeManagerController)
  .use("/geo-location", geoLocationController);

export default Router().use(routes);
