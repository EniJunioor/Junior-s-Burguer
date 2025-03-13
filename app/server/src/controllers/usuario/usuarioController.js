import * as usuarioService from "../usuario/usuarioService.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.js";
import { client } from "../../config/redisConfig.js";
import { gerarAccessToken, gerarRefreshToken, renovarAccessToken, logoutUsuario } from "../../services/authService.js";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// Registrar um novo usuário
export const registrarUsuario = async (req, res) => {
    await client.del("usuarios");
    try {
        const novoUsuario = await usuarioService.registrarUsuario(req.body);
        res.status(201).json({ message: "Usuário criado!", user: { id: novoUsuario.id, email: novoUsuario.email } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login de usuário com Refresh Token
export const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        // Atualiza o hash da senha caso esteja com rounds antigos
        const senhaPrecisaAtualizar = bcrypt.getRounds(usuario.senha) < SALT_ROUNDS;
        if (senhaPrecisaAtualizar) {
            const novoHash = await bcrypt.hash(senha, SALT_ROUNDS);
            await prisma.usuario.update({
                where: { email },
                data: { senha: novoHash },
            });
        }

        const accessToken = gerarAccessToken(usuario);
        const refreshToken = await gerarRefreshToken(usuario);

        res.status(200).json({ message: "Login bem-sucedido", accessToken, refreshToken });
    } catch (error) {
        logger.error("Erro no login:", error);
        res.status(500).json({ error: "Erro no login" });
    }
};

// Renova o Access Token
export const renovarToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ error: "Refresh Token é obrigatório!" });

        const novoAccessToken = await renovarAccessToken(refreshToken);
        res.status(200).json({ accessToken: novoAccessToken });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Logout de usuário
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "Refresh Token é obrigatório!" });

        await logoutUsuario(refreshToken);
        res.status(200).json({ message: "Logout realizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar usuários com cache
export const listarUsuarios = async (req, res) => {
    try {
        const cacheKey = "usuarios";
        // 1. Buscar no cache
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            console.log("Dados servidos do cache!");
            return res.status(200).json(JSON.parse(cacheData));
        }

        // 2. Buscar no banco de dados se não houver cache
        const usuarios = await prisma.usuario.findMany({
            select: { id: true, nome: true, email: true }
        });

        // 3. Salvar no cache por 60 segundos
        await client.setEx(cacheKey, 60, JSON.stringify(usuarios));

        console.log("📦 Dados armazenados no cache!");
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

// Deletar usuário
export const deletarUsuario = async (req, res) => {
    await client.del("usuarios");
    try {
        const resultado = await usuarioService.deletarUsuario(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
