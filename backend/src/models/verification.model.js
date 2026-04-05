import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    documentType: {
      type: String,
      enum: ["license", "id_proof", "vehicle_registration", "insurance"],
      required: true
    },
    fileRef: {
      type: String,
      required: true,
      trim: true
    },
    reviewStatus: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending"
    },
    remarks: {
      type: String,
      default: null,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

verificationSchema.index({ driverId: 1, documentType: 1 }, { unique: true });
verificationSchema.index({ reviewStatus: 1, updatedAt: -1 });

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
