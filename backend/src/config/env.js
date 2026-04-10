import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/ride_hailing",
  jwtSecret: process.env.JWT_SECRET ?? "change-this-secret",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  adminUser: process.env.ADMIN_USER ?? "admin",
  adminPass: process.env.ADMIN_PASS ?? "admin",
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseNumber(process.env.SMTP_PORT, 587),
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM
  }
};

export default env;
