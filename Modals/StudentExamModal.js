import mongoose from "mongoose";
const { Schema } = mongoose;

const StudentExamSchema = new Schema(
  {
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    testId: {
      type: String,
      require: true,
    },
    // batchId: {
    //   type: String,
    //   required: true,
    // },
    batchName: {
      type: String,
      require: true,
    },
    courseName: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    passKey: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    cutOff: { type: String },
    resultType: {
      type: String,
      required: true,
    },

    level: {
      type: String,
    },
    headOfOrganization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    examsSections: [
      {
        examId: {
          type: String,
        },
        totalMarks: {
          type: String,
          required: true,
        },
        cutOff: {
          type: String,
          required: true,
        },
        courseName: {
          type: String,
          require: true,
        },
        topic: {
          type: String,
          require: true,
        },
      },
    ],
    students: [
      {
        email: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        totalMark: {
          type: String,
        },
        afterWritingExams: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  { timestamps: true }
);

const StudentExamModel = mongoose.model("StudentExam", StudentExamSchema);
export default StudentExamModel;
