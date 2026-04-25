import express from "express";
import Module from "../models/Module.js";
import Question from "../models/Question.js";
import UserState from "../models/UserState.js";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const { userId, moduleId } = req.body;

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    const firstQuestion = await Question.findById(module.startQuestionId)
      .populate("options");

    await UserState.findOneAndUpdate(
      { userId },
      {
        userId,
        currentModuleId: module._id,
        currentQuestionId: firstQuestion._id
      },
      { upsert: true, new: true }
    );

    res.json({
      moduleId: module._id,
      questionId: firstQuestion._id,
      text: firstQuestion.text,
      options: firstQuestion.options
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;