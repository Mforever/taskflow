import nodemailer from 'nodemailer';

// Настройка транспортера (для примера используем Mailtrap для тестирования)
// В продакшене замените на реальный SMTP сервер (Яндекс.Почта, Mail.ru, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"TaskFlow" <${process.env.SMTP_FROM || 'noreply@taskflow.com'}>`,
    to: email,
    subject: 'Подтверждение email адреса',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Подтверждение email адреса</h2>
        <p>Для завершения регистрации в TaskFlow, пожалуйста, подтвердите ваш email адрес:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Подтвердить email
        </a>
        <p>Если вы не регистрировались в TaskFlow, просто проигнорируйте это письмо.</p>
        <hr style="margin: 20px 0; border-color: #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">Team TaskFlow</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"TaskFlow" <${process.env.SMTP_FROM || 'noreply@taskflow.com'}>`,
    to: email,
    subject: 'Восстановление пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Восстановление пароля</h2>
        <p>Вы запросили сброс пароля для вашего аккаунта TaskFlow.</p>
        <p>Для установки нового пароля нажмите на кнопку ниже:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Сбросить пароль
        </a>
        <p>Ссылка действительна в течение 1 часа.</p>
        <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        <hr style="margin: 20px 0; border-color: #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">Team TaskFlow</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};