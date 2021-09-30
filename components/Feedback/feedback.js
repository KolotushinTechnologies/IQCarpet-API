const { Schema, model } = require("mongoose");

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  },
  { timestamps: true }
);

module.exports = FeedbackModel = model("Feedback", FeedbackSchema);
