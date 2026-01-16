import { Router } from "express";
import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { taskController } from "./modules/task/task.controller";
import { knowledgeResourceController } from "./modules/knowledge-resources/knowledge-resource.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/tasks", taskController)
  .use("/knowledge-resources", knowledgeResourceController);

export default Router().use(routes);
