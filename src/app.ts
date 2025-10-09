import express from "express";
import index from "@routes/index.route";
import "@config/passport";
import passport from "passport";
import {
  jsonErrorHandler,
  validateContentType,
} from "@middlewares/body.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@config/swagger";

const app = express();
app.use(validateContentType);
app.use(express.json({ limit: "10mb" }));
app.use(jsonErrorHandler);
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", index);

export default app;
