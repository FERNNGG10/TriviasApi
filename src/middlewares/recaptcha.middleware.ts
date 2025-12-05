import { Request, Response, NextFunction } from "express";
import axios from "axios";
import config from "@config/config";

/**
 * Middleware para verificar reCAPTCHA v2
 */
export const verifyRecaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recaptchaToken = req.body.recaptchaToken;

    if (!recaptchaToken) {
      return res.status(400).json({
        message: "reCAPTCHA token is required",
      });
    }

    // Verificar el token con Google
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: config.recaptcha.secretKey,
          response: recaptchaToken,
        },
      }
    );

    const { success, score, action } = response.data;

    // Verificar que la verificación fue exitosa
    if (!success) {
      return res.status(400).json({
        message: "reCAPTCHA verification failed",
        details: response.data["error-codes"],
      });
    }

    // Para reCAPTCHA v2, solo verificamos success
    // Para v3 también verificarías el score (0.0 - 1.0)
    // if (score && score < 0.5) {
    //   return res.status(400).json({
    //     message: "reCAPTCHA score too low"
    //   });
    // }

    // Si todo está bien, continuar
    next();
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return res.status(500).json({
      message: "Error verifying reCAPTCHA",
    });
  }
};

/**
 * Middleware opcional que permite pasar sin reCAPTCHA en desarrollo
 */
export const verifyRecaptchaOptional = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // En desarrollo, permitir pasar sin reCAPTCHA
  if (config.nodeEnv === "development" && !req.body.recaptchaToken) {
    console.log("⚠️ Skipping reCAPTCHA in development mode");
    return next();
  }

  // En producción, requerir reCAPTCHA
  return verifyRecaptcha(req, res, next);
};
