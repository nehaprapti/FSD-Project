import mongoose from "mongoose";

// Apply default timestamps to every schema unless explicitly overridden.
mongoose.plugin((schema) => {
  if (schema.options.timestamps === undefined) {
    schema.set("timestamps", true);
  }
});

let hasRegisteredConnectionEvents = false;

const registerConnectionEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("[MongoDB] Connection established successfully.");
  });

  mongoose.connection.on("error", (error) => {
    console.error("[MongoDB] Connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Connection disconnected.");
  });
};

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set. Please add it to your .env file.");
  }

  if (!hasRegisteredConnectionEvents) {
    registerConnectionEvents();
    hasRegisteredConnectionEvents = true;
  }

  try {
    await mongoose.connect(mongoUri);
    return mongoose.connection;
  } catch (error) {
    console.error("[MongoDB] Initial connection failed:", error.message);
    throw error;
  }
};
