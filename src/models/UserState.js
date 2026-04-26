import { Schema,model } from "mongoose";

const UserStateSchema = new Schema(
    {
        userId:{
            type: String,
            required: true,
            unique: true
        },

        currentModuleId:{
            type: Schema.Types.ObjectId,
            ref: "Module",
            required: true
        },

        currentQuestionId:{
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },

        checkpointHistoryId: {
        type: Schema.Types.ObjectId,
        ref: "ConversationHistory",
        default: null
        },

        checkpointQuestionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        default: null
        },

    },
    {
        timestamps: true
    }
);

export default model("UserState",UserStateSchema);
