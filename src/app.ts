import express from "express";
import index from "@routes/index.route";
import "@config/passport";
import passport from "passport";
import {
  jsonErrorHandler,
  validateContentType,
} from "@middlewares/body.middleware";

const app = express();
app.use(validateContentType);
app.use(express.json({ limit: "10mb" }));
app.use(jsonErrorHandler);
app.use(passport.initialize());

app.use("/api/v1", index);

export default app;
