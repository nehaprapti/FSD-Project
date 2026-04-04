import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true
    },
    raterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ratedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    raterRole: {
      type: String,
      enum: ["passenger", "driver"],
      required: true
    },
    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "score must be an integer between 1 and 5"
      }
    },
    reviewText: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

ratingSchema.index({ rideId: 1, raterRole: 1 }, { unique: true });
ratingSchema.index({ ratedId: 1, createdAt: -1 });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
