import express from "express";
import index from "@routes/index";

const app = express();

app.use(express.json());

app.use("/", index);

export default app;
