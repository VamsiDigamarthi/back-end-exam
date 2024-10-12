import mongoose from "mongoose";
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const TodoModel = mongoose.model("Todo", todoSchema);
export default TodoModel;
