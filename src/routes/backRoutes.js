import express from "express";
import { backService } from "../services/backService.js";

const router = express.Router();

router.post("/",async(req,res)=>{

    try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result =  await backService(userId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
