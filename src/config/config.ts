import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  recaptcha: {
    secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "",
  },
  otp: {
    expirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || "10"),
  },
};

export default config;
