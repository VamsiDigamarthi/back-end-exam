import mongoose from "mongoose";
const { Schema } = mongoose;

const feedBackSchema = new Schema(
  {
    testId: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
    testUniqueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentExam",
    },
    feedbackQuestions: [],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const FeedBackModel = mongoose.model("FeedBack", feedBackSchema);
export default FeedBackModel;
