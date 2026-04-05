import mongoose from "mongoose";

const earningSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      unique: true
    },
    grossAmount: {
      type: Number,
      required: true,
      min: 0
    },
    commissionRate: {
      type: Number,
      required: true,
      min: 0
    },
    commissionAmount: {
      type: Number,
      required: true,
      min: 0
    },
    netAmount: {
      type: Number,
      required: true,
      min: 0
    },
    payoutStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      index: true
    },
    payoutDate: {
      type: Date,
      default: null
    },
    // Backwards-compat fields (optional)
    legacy: {
      grossFare: Number,
      platformFee: Number,
      driverPayout: Number
    }
  },
  { timestamps: true }
);

earningSchema.index({ driverId: 1, createdAt: -1 });

const Earning = mongoose.model("Earning", earningSchema);

export default Earning;
