import sgMail from "@sendgrid/mail";
import config from "@config/config";

class EmailService {
  constructor() {
    if (config.email.sendgridApiKey) {
      sgMail.setApiKey(config.email.sendgridApiKey);
    } else {
      console.warn("⚠️ SendGrid API Key is missing!");
    }
  }

  async sendOTP(email: string, code: string): Promise<void> {
    const msg = {
      to: email,
      from: config.email.from,
      subject: "Tu código de verificación - Trivia Challenge",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
            .header { text-align: center; padding: 20px 0; background-color: #4CAF50; color: white; border-radius: 10px 10px 0 0; }
            .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4CAF50; padding: 20px; background-color: #f0f0f0; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Trivia Challenge</h1></div>
            <div class="content">
              <h2>Código de Verificación</h2>
              <p>Has solicitado un código de verificación para tu cuenta.</p>
              <p>Tu código de verificación es:</p>
              <div class="otp-code">${code}</div>
              <p><strong>Este código expirará en ${config.otp.expirationMinutes} minutos.</strong></p>
              <p>Si no solicitaste este código, por favor ignora este correo.</p>
            </div>
            <div class="footer"><p>© ${new Date().getFullYear()} Trivia Challenge. Todos los derechos reservados.</p></div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("✅ Email sent successfully via SendGrid");
    } catch (error: any) {
      console.error("❌ Error sending email via SendGrid:", error);
      if (error.response) {
        console.error("🔍 SendGrid Error Body:", JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const msg = {
      to: email,
      from: config.email.from,
      subject: "¡Bienvenido a Trivia Challenge!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
            .header { text-align: center; padding: 20px 0; background-color: #4CAF50; color: white; border-radius: 10px 10px 0 0; }
            .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>¡Bienvenido a Trivia Challenge!</h1></div>
            <div class="content">
              <h2>Hola ${name},</h2>
              <p>Gracias por registrarte en Trivia Challenge.</p>
              <p>Tu cuenta ha sido verificada exitosamente y ya puedes comenzar a disfrutar de nuestros quizzes.</p>
              <p>¡Buena suerte y diviértete!</p>
            </div>
            <div class="footer"><p>© ${new Date().getFullYear()} Trivia Challenge. Todos los derechos reservados.</p></div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("✅ Welcome email sent successfully via SendGrid");
    } catch (error: any) {
      console.error("❌ Error sending welcome email via SendGrid:", error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }
}

export default new EmailService();
