import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRATION = "15m"; // 15 minutos
const REFRESH_TOKEN_EXPIRATION = "7d"; // 7 dias

// Gera um novo Access Token
export const gerarAccessToken = (usuario) => {
    return jwt.sign({ id: usuario.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

// Gera um Refresh Token e armazena no banco
export const gerarRefreshToken = async (usuario) => {
    const refreshToken = jwt.sign({ id: usuario.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    // Armazena o Refresh Token no banco
    await prisma.refreshToken.create({
        data: { token: refreshToken, usuarioId: usuario.id }
    });

    return refreshToken;
};

// Valida e renova um Access Token usando o Refresh Token
export const renovarAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error("Refresh Token é obrigatório!");

    const tokenValido = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

    if (!tokenValido) throw new Error("Refresh Token inválido!");

    // Verifica se o Refresh Token ainda é válido
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Gera um novo Access Token
    const novoAccessToken = gerarAccessToken({ id: decoded.id });

    return novoAccessToken;
};

// Remove o Refresh Token (logout)
export const logoutUsuario = async (refreshToken) => {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
};
