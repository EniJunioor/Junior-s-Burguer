
import * as pedidoService from "../pedido/pedidoService.js";

// Criar um novo pedido
export const criarPedido = async (req, res) => {
    const { cliente, itens } = req.body;
    const usuarioId = req.usuario.id;
    
    try {
        const novoPedido = await pedidoService.criarPedido(cliente, itens, usuarioId);
        res.status(201).json(novoPedido);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar pedido", details: error.message });
    }
};

// Atualizar status do pedido
export const atualizarStatusPedido = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const usuarioId = req.usuario.id;
    const isAdmin = req.usuario.role === "ADMIN";

    try {
        const pedidoAtualizado = await pedidoService.atualizarStatusPedido(id, status, usuarioId, isAdmin);
        res.status(200).json(pedidoAtualizado);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

// Listar pedidos do usuário autenticado
export const listarPedidosUsuario = async (req, res) => {
    const usuarioId = req.usuario.id;
    
    try {
        const pedidos = await pedidoService.listarPedidosUsuario(usuarioId);
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar pedidos" });
    }
};

// Deletar pedido
export const deletarPedido = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    const isAdmin = req.usuario.role === "ADMIN";

    try {
        await pedidoService.deletarPedido(id, usuarioId, isAdmin);
        res.status(200).json({ message: "Pedido deletado com sucesso!" });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};
