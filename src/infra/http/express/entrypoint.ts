import { appName, appPort, appUrl, isProduction } from "@/shared/env";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import v1Router from "./api/v1";
import { camelCase } from "./middleware/camelCase";

const app = express();

const origin = {
  origin: isProduction ? appUrl : "*"
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(origin));
app.use(compression());
app.use(helmet());
app.use(camelCase);

app.use("/api/v1", v1Router);

app.listen(appPort, () => {
  console.log(`[${appName}]: Server listening on ${appPort}`);
});

export { app };
