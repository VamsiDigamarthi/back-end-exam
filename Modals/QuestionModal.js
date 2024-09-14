import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema for a question
const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    examId: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
    level: {
      type: String,
    },
    answers: {
      type: [String], // Array of strings to store the options
      required: true,
    },
    CorrectAnswer: {
      type: String,
      required: true,
    },
    DefaultMarks: {
      type: Number,
      required: true,
    },
    DefaultTimeToSolve: {
      type: Number,
      required: true,
    },
    Difficulty_Level: {
      type: String,
      required: true,
    },
    QuestionType: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const Question = mongoose.model("Question", questionSchema);

export default Question;
