import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12; // Melhor segurança nas senhas

// Buscar usuário pelo e-mail
export const buscarUsuarioPorEmail = async (email) => {
    return await prisma.usuario.findUnique({ where: { email } });
};

// Registrar um novo usuário
export const registrarUsuario = async ({ nome, email, senha }) => {
    if (!nome || !email || !senha) {
        throw new Error("Todos os campos são obrigatórios.");
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
        throw new Error("E-mail já cadastrado.");
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    return await prisma.usuario.create({
        data: { nome, email, senha: senhaHash }
    });
};

// Atualizar a senha de um usuário
export const atualizarSenha = async (email, novaSenha) => {
    const novoHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
    await prisma.usuario.update({
        where: { email },
        data: { senha: novoHash },
    });
};

// Login de usuário com atualização de senha, se necessário
export const loginUsuario = async ({ email, senha }) => {
    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios.");
    }

    const usuario = await buscarUsuarioPorEmail(email);
console.log("Usuário encontrado:", usuario);
if (!usuario) {
    throw new Error("Usuário não encontrado.");
}
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        throw new Error("Senha incorreta.");
    }

    // Atualizar senha para um hash mais seguro, se necessário
    if (bcrypt.getRounds(usuario.senha) < SALT_ROUNDS) {
        await atualizarSenha(email, senha);
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("Erro no servidor: chave JWT não configurada.");
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { message: "Login bem-sucedido!", token };
};

// Atualizar um usuário
export const atualizarUsuario = async (id, { nome, email, senha }) => {
    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
        throw new Error("Usuário não encontrado.");
    }

    let senhaHash = usuario.senha;
    if (senha) {
        senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    }

    return await prisma.usuario.update({
        where: { id },
        data: { nome, email, senha: senhaHash },
    });
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
        throw new Error("Usuário não encontrado.");
    }
    await prisma.usuario.delete({ where: { id } });
    return { message: "Usuário deletado com sucesso!" };
};
