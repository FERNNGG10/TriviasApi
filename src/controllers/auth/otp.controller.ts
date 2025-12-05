import { Request, Response } from "express";
import otpService from "@services/otp.service";
import prisma from "@config/database";

/**
 * Solicitar código OTP
 * POST /api/v1/auth/otp/request
 * Body: { email: string }
 */
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Verificar si el email ya está registrado (solo para registro)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Si se está solicitando OTP para registro, el email no debe existir
    if (req.body.purpose === "register" && existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Si se está solicitando OTP para login, el email debe existir
    if (req.body.purpose === "login" && !existingUser) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generar y enviar OTP
    await otpService.generateAndSendOTP(email);

    return res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return res.status(500).json({
      message: "Error sending OTP",
    });
  }
};

/**
 * Verificar código OTP
 * POST /api/v1/auth/otp/verify
 * Body: { email: string, code: string }
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const isValid = await otpService.verifyOTP(email, code);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid or expired OTP code",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "Error verifying OTP",
    });
  }
};

/**
 * Verificar si existe un OTP válido (sin marcarlo como usado)
 * POST /api/v1/auth/otp/check
 * Body: { email: string }
 */
export const checkOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const hasValid = await otpService.hasValidOTP(email);

    return res.status(200).json({
      hasValidOTP: hasValid,
    });
  } catch (error) {
    console.error("Error checking OTP:", error);
    return res.status(500).json({
      message: "Error checking OTP",
    });
  }
};
