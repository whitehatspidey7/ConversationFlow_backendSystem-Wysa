import ConversationHistory from "../models/ConversationHistory.js";
import UserState from "../models/UserState.js";
import Question from "../models/Question.js";

export const backService = async (userId) => {

  const state = await UserState.findOne({ userId });
  if (!state) throw new Error("User state not found");

  // 1. Get latest history
  const last = await ConversationHistory
    .findOne({ userId })
    .sort({ _id: -1 });

  if (!last) {
    throw new Error("No previous state");
  }

  // 2. STRICT CHECKPOINT BLOCK
  if (
    state.checkpointHistoryId &&
    last._id.toString() === state.checkpointHistoryId.toString()
  ) {
    throw new Error("Cannot go back beyond checkpoint");
  }

  // 3. Delete last step
  await ConversationHistory.deleteOne({ _id: last._id });

  // 4. Get new latest (previous state)
  const previous = await ConversationHistory
    .findOne({ userId })
    .sort({ _id: -1 });

  if (!previous) {
    throw new Error("No earlier state available");
  }

  // 5. Update state
  await UserState.findOneAndUpdate(
    { userId },
    {
      currentModuleId: previous.moduleId,
      currentQuestionId: previous.questionId
    }
  );

  // 6. Fetch question
  const question = await Question.findById(previous.questionId)
    .populate("options");

  return {
    moduleId: previous.moduleId,
    questionId: question._id,
    text: question.text,
    options: question.options.map(o => ({
      optionId: o._id,
      text: o.text
    }))
  };
};