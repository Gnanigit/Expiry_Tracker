import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
