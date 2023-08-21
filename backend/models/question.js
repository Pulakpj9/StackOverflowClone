/* ------------------------------------------- Dependencies Import Section ---------------------------------- */

import mongoose from "mongoose";

/* ------------------------------------------- question Schema Section ----------------------------------------- */

const QuestionSchema = mongoose.Schema({
    qid: {
        type: String,
        required: true,
        unique: true,
    },
    question: {
        type: String,
        required: true,
    },
    creator_id: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Questions = mongoose.model("questions", QuestionSchema);