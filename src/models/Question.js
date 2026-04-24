import { model ,Schema }  from "mongoose";


const QuestionSchema = new Schema(
    {
        text:{
            type: String,
            required: true
        },

        moduleId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Module"
        },

        options:[{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Option"
        }], // there can be multiple options, hence array of options
        
        isCheckpoint: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps:true
    }
);

export default mongoose.model("Question",QuestionSchema);