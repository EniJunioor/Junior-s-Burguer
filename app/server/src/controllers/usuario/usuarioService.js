// services/usuarioService.js
import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";
import jwt from "jsonwebtoken";

// Registrar um novo usuário
export const registrarUsuario = async ({ nome, email, senha }) => {
    if (!nome || !email || !senha) {
        throw new Error("Todos os campos são obrigatórios");
    }

    const usuarioExistente = await prisma.usuario.findFirst({ where: { email } });
    if (usuarioExistente) {
        throw new Error("E-mail já cadastrado");
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    return await prisma.usuario.create({
        data: { nome, email, senha: senhaHash }
    });
};

// Login de usuário
export const loginUsuario = async ({ email, senha }) => {
    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios.");
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
        throw new Error("Usuário não encontrado.");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        throw new Error("Senha incorreta.");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("Erro no servidor: chave JWT não configurada.");
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { message: "Login bem-sucedido!", token };
};

// Listar usuários
export const listarUsuarios = async () => {
    return await prisma.usuario.findMany({
        select: { id: true, nome: true, email: true }
    });
};

// Deletar usuário
export const deletarUsuario = async (id) => {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }
    await prisma.usuario.delete({ where: { id } });
    return { message: "Usuário deletado com sucesso!" };
};
