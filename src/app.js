import express from "express";
import  answerRoutes from "./routes/answerRoutes.js";
import  moduleRoutes from "./routes/moduleRoutes.js";
import backRoutes from "./routes/backRoutes.js";

const app = express();

app.use(express.json()); // json middle for parsing


app.use("/answer",answerRoutes);
app.use("/module",moduleRoutes);
app.use("/back",backRoutes);

export default app;
