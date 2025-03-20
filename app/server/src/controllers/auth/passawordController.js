import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMFAEmail } from "../../services/mailer.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// Solicitar recuperação de senha
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.usuario.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Remover tokens antigos antes de gerar um novo
        await prisma.usuario.update({
            where: { email },
            data: { resetToken: null, resetTokenExpires: null }
        });

        // Criar novo token de recuperação
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, SALT_ROUNDS);
        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora de validade

        // Salvar no banco de dados
        await prisma.usuario.update({
            where: { email },
            data: { resetToken: hashedToken, resetTokenExpires: tokenExpiration }
        });

        // Enviar e-mail com o link de redefinição
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
        await sendMFAEmail(email, "Redefinição de Senha", `Clique no link para redefinir sua senha: ${resetLink}`);

        res.json({ message: "E-mail de recuperação enviado!" });
    } catch (error) {
        console.error("Erro ao processar recuperação de senha:", error);
        res.status(500).json({ error: "Erro ao processar solicitação" });
    }
};

// Redefinir senha
export const resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;

    try {
        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user || !user.resetToken || !user.resetTokenExpires) {
            return res.status(400).json({ error: "Token inválido ou expirado" });
        }

        // Verificar se o token é válido
        const isTokenValid = await bcrypt.compare(token, user.resetToken);
        const isTokenExpired = new Date() > user.resetTokenExpires;

        if (!isTokenValid || isTokenExpired) {
            return res.status(400).json({ error: "Token inválido ou expirado" });
        }

        // Impedir que a nova senha seja a mesma que a atual
        const isSamePassword = await bcrypt.compare(newPassword, user.senha);
        if (isSamePassword) {
            return res.status(400).json({ error: "A nova senha não pode ser igual à anterior." });
        }

        // Atualizar a senha e remover o token
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await prisma.usuario.update({
            where: { email },
            data: { 
                senha: hashedPassword, 
                resetToken: null, 
                resetTokenExpires: null 
            }
        });

        res.json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ error: "Erro ao redefinir senha" });
    }
};
