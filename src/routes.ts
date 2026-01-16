import { Router } from "express";
import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController);

export default Router().use(routes);
