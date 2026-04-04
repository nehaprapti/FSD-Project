import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["passenger", "driver", "admin"],
      default: "passenger"
    },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Compatibility bridge for existing auth flows that still read/write "password".
userSchema.virtual("password")
  .get(function getPassword() {
    return this.passwordHash;
  })
  .set(function setPassword(password) {
    this.passwordHash = password;
  });

// Compatibility bridge for existing admin/auth logic that still uses "isActive".
userSchema.virtual("isActive")
  .get(function getIsActive() {
    return this.status === "active";
  })
  .set(function setIsActive(isActive) {
    this.status = isActive ? "active" : "blocked";
  });

userSchema.index({ role: 1, status: 1 });

const User = mongoose.model("User", userSchema);

export default User;
