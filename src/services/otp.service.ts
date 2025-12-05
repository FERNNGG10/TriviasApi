import otpGenerator from "otp-generator";
import prisma from "@config/database";
import config from "@config/config";
import emailService from "./email.service";
import bcrypt from "bcrypt";

class OTPService {
  /**
   * Genera y envía un código OTP al email especificado
   */
  async generateAndSendOTP(email: string): Promise<void> {
    // Generar código OTP de 6 dígitos
    const code = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Calcular tiempo de expiración
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + config.otp.expirationMinutes
    );

    // Invalidar códigos OTP anteriores no verificados para este email
    await prisma.oTP.updateMany({
      where: {
        email,
        verified: false,
      },
      data: {
        verified: true, // Marcar como verificados para invalidarlos
      },
    });

    // Hash del código OTP
    const hashedCode = await bcrypt.hash(code, 10);

    // Guardar nuevo código OTP en la base de datos (hasheado)
    await prisma.oTP.create({
      data: {
        email,
        code: hashedCode,
        expiresAt,
      },
    });

    // Enviar código por email
    await emailService.sendOTP(email, code);
  }

  /**
   * Verifica si un código OTP es válido
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otps = await prisma.oTP.findMany({
      where: {
        email,
        verified: false,
        expiresAt: {
          gt: new Date(), // Mayor que la fecha actual (no expirado)
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!otps || otps.length === 0) {
      return false;
    }

    // Verificar el código contra los hashes encontrados (empezando por el más reciente)
    let validOtpId = null;

    for (const otp of otps) {
      const isValid = await bcrypt.compare(code, otp.code);
      if (isValid) {
        validOtpId = otp.id;
        break;
      }
    }

    if (!validOtpId) {
      return false;
    }

    // Marcar el OTP como verificado
    await prisma.oTP.update({
      where: { id: validOtpId },
      data: { verified: true },
    });

    return true;
  }

  /**
   * Limpia códigos OTP expirados (para ejecutar periódicamente)
   */
  async cleanExpiredOTPs(): Promise<void> {
    await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(), // Menor que la fecha actual (expirados)
        },
      },
    });
  }

  /**
   * Verifica si existe un OTP válido sin marcarlo como verificado
   */
  async hasValidOTP(email: string): Promise<boolean> {
    const otp = await prisma.oTP.findFirst({
      where: {
        email,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return !!otp;
  }
}

export default new OTPService();
