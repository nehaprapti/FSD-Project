import mongoose from "mongoose";

const savedLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (value) => Array.isArray(value) && value.length === 2,
          message: "Coordinates must be [longitude, latitude]"
        }
      }
    }
  },
  { _id: false }
);

const passengerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    savedLocations: {
      type: [savedLocationSchema],
      default: []
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    tripHistory: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ride"
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

const Passenger = mongoose.model("Passenger", passengerSchema);

export default Passenger;
