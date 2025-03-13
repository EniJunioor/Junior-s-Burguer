import * as usuarioService from "../usuario/usuarioService.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import logger from "../../config/logger.js";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12; 


// Registrar um novo usuário
export const registrarUsuario = async (req, res) => {
    try {
        const novoUsuario = await usuarioService.registrarUsuario(req.body);
        res.status(201).json({ message: "Usuário criado!", user: { id: novoUsuario.id, email: novoUsuario.email } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login de usuário
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

        res.status(200).json({ message: "Código enviado" });

    } catch (error) {
        logger.error("Erro no login:", error);
        res.status(500).json({ error: "Erro no login" });
    }
    
};

// Listar usuários
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

// Deletar usuário
export const deletarUsuario = async (req, res) => {
    try {
        const resultado = await usuarioService.deletarUsuario(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
