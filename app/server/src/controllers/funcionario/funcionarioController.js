import { 
    criarFuncionario, 
    listarFuncionarios, 
    editarFuncionario, 
    excluirFuncionario } from "../funcionario/funcionarioService.js";

// Criar funcionário
export const criarFuncionarioController = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    try {
        const novoFuncionario = await criarFuncionario(nome, email, senha, role);
        res.status(201).json({ message: "Funcionário criado!", funcionario: { id: novoFuncionario.id, email: novoFuncionario.email, role: novoFuncionario.role } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar funcionários
export const listarFuncionariosController = async (req, res) => {
    try {
        const funcionarios = await listarFuncionarios();
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar funcionários" });
    }
};

// Editar funcionário
export const editarFuncionarioController = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body;

    try {
        const funcionarioAtualizado = await editarFuncionario(id, nome, email, senha, role);
        res.status(200).json({ message: "Funcionário atualizado!", funcionario: funcionarioAtualizado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Excluir funcionário
export const excluirFuncionarioController = async (req, res) => {
    const { id } = req.params;

    try {
        await excluirFuncionario(id);
        res.status(200).json({ message: "Funcionário excluído com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
