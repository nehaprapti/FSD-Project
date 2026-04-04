import mongoose from "mongoose";

const earningSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true
    },
    grossFare: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    driverPayout: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Earning = mongoose.model("Earning", earningSchema);

export default Earning;
