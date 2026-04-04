import mongoose from "mongoose";

const demandZoneSchema = new mongoose.Schema(
  {
    areaCode: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    multiplier: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    startsAt: {
      type: Date,
      default: null
    },
    endsAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

demandZoneSchema.index({ areaCode: 1, isActive: 1, startsAt: 1, endsAt: 1 });

const DemandZone = mongoose.model("DemandZone", demandZoneSchema);

export default DemandZone;
