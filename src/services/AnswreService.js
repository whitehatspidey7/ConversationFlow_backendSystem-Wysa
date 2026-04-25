import UserState from "../models/UserState.js";
import Module from "../models/Module.js";
import Question from "../models/Question.js";
import Option from "../models/Option.js";
import ConversationHistory from "../models/ConversationHistory.js";

export const answerService = async (userId, optionId) => {

  // 1. Get current user state
  const state = await UserState.findOne({ userId });

  if (!state) {
    throw new Error("User state not found. Start a module first.");
  }

  // 2. Get selected option
  const option = await Option.findById(optionId);

  if (!option) {
    throw new Error("Invalid option");
  }

  // 3. Validate option belongs to current question
  if (option.questionId.toString() !== state.currentQuestionId.toString()) {
    throw new Error("Option does not belong to current question");
  }

  // 4. Save conversation history (append-only)
  await ConversationHistory.create({
    userId,
    moduleId: state.currentModuleId,
    questionId: state.currentQuestionId,
    selectedOptionId: optionId
  });

  let nextModuleId = state.currentModuleId;
  let nextQuestion = null;

  // 5. Decide next step

  // Case A: Move to next question
  if (option.nextQuestionId) {
    nextQuestion = await Question.findById(option.nextQuestionId)
      .populate("options");
  }

  // Case B: Switch module
  else if (option.nextModuleId) {
    const nextModule = await Module.findById(option.nextModuleId);

    if (!nextModule) {
      throw new Error("Target module not found");
    }

    nextModuleId = nextModule._id;

    nextQuestion = await Question.findById(nextModule.startQuestionId)
      .populate("options");
  }

  // Case C: Invalid flow
  else {
    throw new Error("Option has no valid next step");
  }

  if (!nextQuestion) {
    throw new Error("Next question not found");
  }

  // 6. Handle checkpoint (basic)
  if (nextQuestion.isCheckpoint) {
    // For now, just log (advanced reset can be added later)
    console.log("Checkpoint reached");
  }

  // 7. Update user state
  await UserState.findOneAndUpdate(
    { userId },
    {
      currentModuleId: nextModuleId,
      currentQuestionId: nextQuestion._id
    },
    { new: true }
  );

  // 8. Return response
  return {
    moduleId: nextModuleId,
    questionId: nextQuestion._id,
    text: nextQuestion.text,
    options: nextQuestion.options.map(opt => ({
      optionId: opt._id,
      text: opt.text
    }))
  };
};