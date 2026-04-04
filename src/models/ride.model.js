import mongoose from "mongoose";

export const RIDE_STATUSES = [
  "requested",
  "searching_driver",
  "driver_assigned",
  "driver_arrived",
  "trip_started",
  "trip_completed",
  "no_driver_found",
  "cancelled_by_passenger",
  "cancelled_by_driver"
];

const geoPointSchema = new mongoose.Schema(
  {
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
        message: "GeoJSON coordinates must be [longitude, latitude]"
      }
    }
  },
  { _id: false }
);

const stopSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: geoPointSchema,
      required: true
    }
  },
  { _id: false }
);

const statusHistoryItemSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: RIDE_STATUSES,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    offeredDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rejectedDriverIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    },
    rideType: {
      type: String,
      enum: ["solo", "shared"],
      default: "solo"
    },
    pickup: {
      type: stopSchema,
      required: true
    },
    drop: {
      type: stopSchema,
      required: true
    },
    estimatedFare: {
      type: Number,
      required: true,
      min: 0
    },
    finalFare: {
      type: Number,
      default: null,
      min: 0
    },
    status: {
      type: String,
      enum: RIDE_STATUSES,
      default: "requested"
    },
    statusHistory: {
      type: [statusHistoryItemSchema],
      default: () => [{ status: "requested", timestamp: new Date() }]
    },
    sharedRideGroupId: {
      type: String,
      default: null,
      trim: true
    },
    seatsBooked: {
      type: Number,
      default: 1,
      min: 1
    },
    cancelledBy: {
      type: String,
      enum: ["passenger", "driver", null],
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    distanceKm: {
      type: Number,
      min: 0
    },
    estimatedDurationMin: {
      type: Number,
      min: 0
    },
    actualDurationMin: {
      type: Number,
      min: 0
    },
    surgeMultiplier: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

rideSchema.index({ passengerId: 1, createdAt: -1 });
rideSchema.index({ driverId: 1, createdAt: -1 });
rideSchema.index({ status: 1, createdAt: -1 });
rideSchema.index({ sharedRideGroupId: 1 });
rideSchema.index({ "pickup.location": "2dsphere" });
rideSchema.index({ "drop.location": "2dsphere" });

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
