import mongoose from "mongoose";

const demandZoneSchema = new mongoose.Schema(
  {
    // primary identifier (geohash precision 6)
    zoneId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    // legacy alias used in other parts of the codebase
    areaCode: {
      type: String,
      required: true,
      trim: true
    },
    geohash: {
      type: String,
      required: true,
      trim: true
    },
    timeSlot: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
      index: true
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      index: true
    },
    requestCount: {
      type: Number,
      default: 0,
      min: 0
    },
    activeDrivers: {
      type: Number,
      default: 0,
      min: 0
    },
    completedRides: {
      type: Number,
      default: 0,
      min: 0
    },
    cancellations: {
      type: Number,
      default: 0,
      min: 0
    },
    demandScore: {
      type: Number,
      default: 0
    },
    surgeMultiplier: {
      type: Number,
      default: 1,
      min: 1
    },
    // kept for compatibility with existing pricing API
    multiplier: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

demandZoneSchema.index({ zoneId: 1, timeSlot: 1, dayOfWeek: 1 });

const DemandZone = mongoose.model("DemandZone", demandZoneSchema);

export default DemandZone;
