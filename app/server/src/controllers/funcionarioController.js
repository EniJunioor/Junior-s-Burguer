import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
import { verificarAdmin } from "../middlewares/verificarAdmin.js";

// Criar funcionário
export const criarFuncionario = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    try {
        const funcionarioExistente = await prisma.funcionario.findUnique({ where: { email } });
        if (funcionarioExistente) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoFuncionario = await prisma.funcionario.create({
            data: { nome, email, senha: senhaHash, role },
        });

        res.status(201).json({ message: "Funcionário criado!", funcionario: { id: novoFuncionario.id, email: novoFuncionario.email, role: novoFuncionario.role } });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar funcionário" });
    }
};


export const listarFuncionarios = async (req, res) => {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            select: { id: true, nome: true, email: true, role: true }
        });
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar funcionários" });
    }
};

// Editar funcionário
export const editarFuncionario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body;

    try {
        const funcionarioExistente = await prisma.funcionario.findUnique({ where: { id: Number(id) } });
        if (!funcionarioExistente) {
            return res.status(404).json({ error: "Funcionário não encontrado" });
        }

        let senhaHash = funcionarioExistente.senha;
        if (senha) {
            senhaHash = await bcrypt.hash(senha, 10);
        }

        const funcionarioAtualizado = await prisma.funcionario.update({
            where: { id: Number(id) },
            data: { nome, email, senha: senhaHash, role },
        });

        res.status(200).json({ message: "Funcionário atualizado!", funcionario: funcionarioAtualizado });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
};

// Excluir funcionário
export const excluirFuncionario = async (req, res) => {
    const { id } = req.params;

    try {
        const funcionarioExistente = await prisma.funcionario.findUnique({ where: { id: Number(id) } });
        if (!funcionarioExistente) {
            return res.status(404).json({ error: "Funcionário não encontrado" });
        }

        await prisma.funcionario.delete({ where: { id: Number(id) } });

        res.status(200).json({ message: "Funcionário excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir funcionário" });
    }
};