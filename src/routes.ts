import { Router } from "express";
import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { knowledgeResourceController } from "./modules/knowledge-manager/knowledge-resources/knowledge-resource.controller";
import { knowledgeMetadataController } from "./modules/knowledge-manager/knowledge-metadata/knowledge-metadata.controller";
import { knowledgeVersionController } from "./modules/knowledge-manager/knowledge-versions/knowledge-version.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/knowledge-resources", knowledgeResourceController)
  .use("/knowledge-metadata", knowledgeMetadataController)
  .use("/knowledge-versions", knowledgeVersionController);

export default Router().use(routes);
