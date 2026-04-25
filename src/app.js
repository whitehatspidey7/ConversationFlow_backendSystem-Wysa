import express from "express";
import  answerRoutes from "./routes/answerRoutes.js";
import  moduleRoutes from "./routes/moduleRoutes.js";

const app = express();

app.use(express.json()); // json middle for parsing


app.use("/answer",answerRoutes);
app.use("/module",moduleRoutes);

export default app;
