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
    try {
        console.log("🔍 Iniciando login...");
        
        const { email, senha } = req.body;
        if (!email || !senha) {
            console.error("⚠️ Email e senha são obrigatórios.");
            return res.status(400).json({ error: "Email e senha são obrigatórios." });
        }

        const usuario = await usuarioService.buscarUsuarioPorEmail(email);
        console.log("👤 Usuário encontrado:", usuario);

        if (!usuario) {
            console.error("🚨 Usuário não encontrado:", email);
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        console.log("🔑 Senha correta?", senhaCorreta);

        if (!senhaCorreta) {
            console.error("❌ Senha incorreta.");
            return res.status(401).json({ error: "Senha incorreta." });
        }

        // Atualizar senha para um hash mais seguro, se necessário
        if (bcrypt.getRounds(usuario.senha) < SALT_ROUNDS) {
            console.log("🔄 Atualizando senha...");
            await usuarioService.atualizarSenha(email, senha);
        }

        if (!process.env.JWT_SECRET) {
            console.error("🛑 Erro no servidor: chave JWT não configurada.");
            return res.status(500).json({ error: "Erro no servidor: chave JWT não configurada." });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("✅ Login bem-sucedido! Token gerado.");

        return res.status(200).json({ message: "Login bem-sucedido!", token });

    } catch (error) {
        console.error("❌ Erro no login:", error.message);
        return res.status(500).json({ error: "Erro no login" });
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

// Atualizar usuário
export const atualizarUsuario = async (req, res) => {
    await client.del("usuarios");
    try {
        const { id } = req.params; // ID do usuário a ser atualizado
        const dadosAtualizados = req.body; // Dados a serem atualizados

        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, dadosAtualizados);
        res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
