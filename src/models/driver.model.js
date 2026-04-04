import mongoose from "mongoose";

const vehicleInfoSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    plate: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    seats: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const licenseInfoSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    expiry: { type: Date, required: true }
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    vehicleInfo: {
      type: vehicleInfoSchema,
      required: true
    },
    licenseInfo: {
      type: licenseInfoSchema,
      required: true
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending"
    },
    availabilityStatus: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
        validate: {
          validator: (value) => Array.isArray(value) && value.length === 2,
          message: "Coordinates must be [longitude, latitude]"
        }
      }
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalTrips: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

driverSchema.index({ currentLocation: "2dsphere" });

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
