import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email must be valid"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

