import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    studentId: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
    },
    course: {
      type: String,
    },
    batchName: {
      type: String,
    },

    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
