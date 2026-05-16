import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pinned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.owner;
        delete ret.sharedWith;
        return ret;
      },
    },
  }
);

noteSchema.index({ title: "text", content: "text" });

export default mongoose.model("Note", noteSchema);

