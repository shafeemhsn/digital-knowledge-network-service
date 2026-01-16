import { Router } from "express";
import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { knowledgeResourceController } from "./modules/knowledge-resources/knowledge-resource.controller";
import { knowledgeMetadataController } from "./modules/knowledge-metadata/knowledge-metadata.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/knowledge-resources", knowledgeResourceController)
  .use("/knowledge-metadata", knowledgeMetadataController);

export default Router().use(routes);
