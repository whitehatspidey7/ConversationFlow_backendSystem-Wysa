import mongoose, { Schema, model } from "mongoose";

const OptionSchema = new Schema({
    
    text: {
        type: String,
        required: true
    },

    questionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Question"
    },
    // to navigate to next question upon choosing this option.
    nextQuestionId:{
        type: Schema.Types.ObjectId,
        default: null,
        ref: "Question"
    },

    nextModuleId:{
        type: mongoose.Types.ObjectId,
        default: null,
        ref: "Module"
    },
}, { timestamps: true});


// middleware to ensure either we go to next question or next module.

OptionSchema.pre("save", (next)=>
{
    if(this.nextQuestionId && this.nextModuleId)
    {
        return next(new Error("An option cannot have both nextQuestionId and nextModuleId"));
    }
    else
    {
        next();
    }
});

export default model("Option",OptionSchema);