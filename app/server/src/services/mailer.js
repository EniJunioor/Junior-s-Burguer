import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar o código MFA
export const sendMFAEmail = async (to, code) => {
  const mailOptions = {
    from: `"Junior's Burgues" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Código de Verificação',
    text: `Seu código de verificação é: ${code}`,
    html: `<p>Seu código de verificação é: <strong>${code}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso para:', to);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};
