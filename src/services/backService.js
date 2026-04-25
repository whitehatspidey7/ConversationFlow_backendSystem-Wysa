import ConversationHistory from "../models/ConversationHistory.js";
import UserState from "../models/UserState.js";
import Question from "../models/Question.js";

export const backService = async(userId) =>
{   // can be sorted  using createdAt but Id is also created chronologically and id sort is faster.
    const UserHistory = await ConversationHistory.find({userId}).sort({_id: -1}).limit(2); // states with current question and previous question

    if(UserHistory.length < 2)
    {
        throw new Error("No previous lesson to go back");
    }

    const currentState = UserHistory[0];
    const previousState = UserHistory[1];

    // remove the current state since we are reverting back to the previous question
    await ConversationHistory.findByIdAndDelete(currentState._id);

    await UserState.findOneAndUpdate(
    {userId},
    {currentQuestionId: previousState.questionId,
    currentModuleId: previousState.moduleId}
    );

    const question = await Question.findById(previousState.questionId)
    .populate("options");

    return {
        questionId: question._id,
        text: question.text,
        options: question.options.map(opt => ({
            optionId: opt._id,
            text: opt.text
        }))
    };
};