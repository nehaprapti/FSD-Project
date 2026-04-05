import mongoose from "mongoose";

const locationLogSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      index: true
    },
    eventType: {
      type: String,
      enum: ["location_ping", "arrived_pickup", "trip_started", "trip_ended"],
      default: "location_ping"
    },
    source: {
      type: String,
      enum: ["driver", "system"],
      default: "driver"
    },
    location: {
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
    },
    speed: {
      type: Number,
      default: null
    },
    heading: {
      type: Number,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

locationLogSchema.index({ rideId: 1, timestamp: 1 });
locationLogSchema.index({ location: "2dsphere" });

const LocationLog = mongoose.model("LocationLog", locationLogSchema);

export default LocationLog;
