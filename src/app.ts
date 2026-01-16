import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
