import { sendMFAEmail } from "../../services/mailer.js"

const generateMFACode = () => Math.floor(100000 + Math.random() * 900000); // Gera um código de 6 dígitos

export const requestMFA = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }

  const code = generateMFACode();

  // Aqui você pode armazenar o código no banco de dados para validar depois
  // Exemplo: await prisma.mfaCode.create({ data: { email, code, expiresAt: new Date(Date.now() + 5 * 60000) }});

  await sendMFAEmail(email, code);
  return res.status(200).json({ message: 'Código enviado para seu e-mail!' });
};
