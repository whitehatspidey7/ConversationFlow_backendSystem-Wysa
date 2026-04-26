import UserState from "../models/UserState.js";
import Module from "../models/Module.js";
import Question from "../models/Question.js";
import Option from "../models/Option.js";
import ConversationHistory from "../models/ConversationHistory.js";

export const answerService = async (userId, optionId) => {

  // 1. Get state
  const state = await UserState.findOne({ userId });
  if (!state) throw new Error("User state not found");

  // 2. Validate option
  const option = await Option.findById(optionId);
  if (!option) throw new Error("Invalid option");

  if (option.questionId.toString() !== state.currentQuestionId.toString()) {
    throw new Error("Option does not belong to current question");
  }

  // 3. Resolve next step
  let nextModuleId = state.currentModuleId;
  let nextQuestion;

  if (option.nextQuestionId) {
    nextQuestion = await Question.findById(option.nextQuestionId).populate("options");
  } 
  else if (option.nextModuleId) {
    const nextModule = await Module.findById(option.nextModuleId);
    if (!nextModule) throw new Error("Module not found");

    nextModuleId = nextModule._id;
    nextQuestion = await Question.findById(nextModule.startQuestionId).populate("options");
  } 
  else {
    throw new Error("Invalid flow");
  }

  if (!nextQuestion) throw new Error("Next question not found");

  // 4. Save CURRENT state to history (BEFORE moving)
  const historyEntry = await ConversationHistory.create({
    userId,
    moduleId: state.currentModuleId,
    questionId: state.currentQuestionId,
    optionId
  });

  // 5. STRICT CHECKPOINT HANDLING
  const update = {
    currentModuleId: nextModuleId,
    currentQuestionId: nextQuestion._id
  };

  if (nextQuestion.isCheckpoint) {
    update.checkpointHistoryId = historyEntry._id;
    update.checkpointQuestionId = nextQuestion._id;
  }

  await UserState.findOneAndUpdate({ userId }, update);

  // 6. Return response
  return {
    moduleId: nextModuleId,
    questionId: nextQuestion._id,
    text: nextQuestion.text,
    options: nextQuestion.options.map(o => ({
      optionId: o._id,
      text: o.text
    }))
  };
};