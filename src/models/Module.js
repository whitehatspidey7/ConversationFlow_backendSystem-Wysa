import  {model, Schema } from "mongoose";

const ModuleSchema = new Schema(
    {
        name:
        {
            type: String,
            required: true
        },

        startQuestionId:
        {
            type: Schema.Types.ObjectId,
            required:true,
            ref: "Question"
        }
    },
    {
        timestamps:true

    }
);

export default model("Module",ModuleSchema);