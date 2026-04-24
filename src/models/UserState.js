import { Schema,model } from "mongoose";

const UserStateSchema = new Schema(
    {
        userId:{
            type: String,
            required: String,
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
        }

    },
    {
        timestamps: true
    }
);

export default model("UserState",UserStateSchema);
