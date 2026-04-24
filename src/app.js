import express from "express";

const app = express();

app.use(express.json()); // json middle for parsing

app.get("/",(req,res)=>
{
    res.send("server is running");
});


export default app;
