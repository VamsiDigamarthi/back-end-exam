import mongoose from "mongoose";
const { Schema } = mongoose;

const studentFeedSchema = new Schema(
  {
    feedBacks: [],
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentExam",
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const StudentFeedBack = mongoose.model("StudentFeedBack", studentFeedSchema);
export default StudentFeedBack;
