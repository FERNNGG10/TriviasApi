import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  recaptcha: {
    secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  },
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY || "",
    from: process.env.EMAIL_FROM || "",
  },
  otp: {
    expirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || "10"),
  },
};

export default config;
