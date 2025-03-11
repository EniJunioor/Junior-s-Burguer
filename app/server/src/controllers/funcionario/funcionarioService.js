import prisma from "../../config/db.js";
import bcrypt from "bcryptjs";

// Criar funcionário (Controller)
export const criarFuncionario = async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        if (!nome || !email || !senha || !role) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const funcionarioExistente = await prisma.funcionario.findUnique({ where: { email } });
        if (funcionarioExistente) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoFuncionario = await prisma.funcionario.create({
            data: { nome, email, senha: senhaHash, role },
        });

        res.status(201).json({ message: "Funcionário criado com sucesso!", funcionario: novoFuncionario });
    } catch (error) {
        console.error("❌ Erro ao criar funcionário:", error);
        res.status(500).json({ error: "Erro ao criar funcionário" });
    }
};

// Listar funcionários
export const listarFuncionarios = async () => {
    return prisma.funcionario.findMany({
        select: { id: true, nome: true, email: true, role: true }
    });
};

// Editar funcionário
export const editarFuncionario = async (id, nome, email, senha, role) => {
    const funcionarioExistente = await prisma.funcionario.findUnique({ where: { id: Number(id) } });
    if (!funcionarioExistente) {
        throw new Error("Funcionário não encontrado");
    }

    let senhaHash = funcionarioExistente.senha;
    if (senha) {
        senhaHash = await bcrypt.hash(senha, 10);
    }

    return prisma.funcionario.update({
        where: { id: Number(id) },
        data: { nome, email, senha: senhaHash, role },
    });
};

// Excluir funcionário
export const excluirFuncionario = async (id) => {
    const funcionarioExistente = await prisma.funcionario.findUnique({ where: { id: Number(id) } });
    if (!funcionarioExistente) {
        throw new Error("Funcionário não encontrado");
    }

    return prisma.funcionario.delete({ where: { id: Number(id) } });
};
