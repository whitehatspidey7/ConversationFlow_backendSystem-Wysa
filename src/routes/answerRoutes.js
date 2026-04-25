import express from "express";
import { answerService } from "../services/AnswerService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, optionId } = req.body;

    const result = await answerService(userId, optionId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;