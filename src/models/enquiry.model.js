import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    courseInterest: {
      type: String,
      required: [true, "Course interest is required"],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    isClaimed: {
      type: Boolean,
      default: false,
      index: true, // Index for faster queries
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
enquirySchema.index({ isClaimed: 1, claimedBy: 1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
