import {model,Schema} from "mongoose";

const HistorySchema = new Schema({
    
    userId:{
        type:String,
        required: true
    },

    moduleId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Module"
    },

    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },

    selectedOptionId: {
        type: Schema.Types.ObjectId,
        ref: "Option",
        required: false
    },

    isCheckpointBoundary: {
    type: Boolean,
    default: false
    }   

},{timestamps: true}); 

export default model("ConversationHistory",HistorySchema);