import prisma from "../config/db.js";

export const criarPedido = async (req, res) => {
    const { cliente, itens } = req.body;
    const usuarioId = req.usuario.id; 

    try {
        const novoPedido = await prisma.pedido.create({
            data: {
                cliente, 
                usuarioId,
                status: "PENDENTE",
                itens: {
                    create: itens.map(item => ({
                        produtoId: item.produtoId,
                        quantidade: item.quantidade,
                        preco: item.preco
                    }))
                }
            },
            include: { itens: true }
        });

        res.status(201).json(novoPedido);
    } catch (error) {
        console.error("❌ Erro ao criar pedido:", error);
        res.status(500).json({ error: "Erro ao criar pedido", details: error.message });
    }
};

// Atualizar status do pedido (somente dono pode atualizar)
export const atualizarStatusPedido = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Verifica se o pedido existe
        const pedido = await prisma.pedido.findUnique({ where: { id } });
        
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        // Atualiza o status do pedido
        const pedidoAtualizado = await prisma.pedido.update({
            where: { id },
            data: { status }
        });

        res.status(200).json(pedidoAtualizado);
    } catch (error) {
        console.error("❌ Erro ao atualizar pedido:", error);
        res.status(500).json({ error: "Erro ao atualizar pedido" });
    }
};



// Listar pedidos do usuário autenticado
export const listarPedidosUsuario = async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        const pedidos = await prisma.pedido.findMany({
            where: { usuarioId },
        });

        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        res.status(500).json({ error: "Erro ao listar pedidos" });
    }
};



// Deletar pedido (somente dono pode deletar)
export const deletarPedido = async (req, res) => {
    const { id } = req.params;

    try {
        // Verifica se o pedido existe antes de deletar
        const pedido = await prisma.pedido.findUnique({ where: { id } });

        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        // Deleta o pedido e seus itens relacionados
        await prisma.itemPedido.deleteMany({ where: { pedidoId: id } }); // Remove os itens primeiro
        await prisma.pedido.delete({ where: { id } });

        res.status(200).json({ message: "Pedido deletado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao deletar pedido:", error);
        res.status(500).json({ error: "Erro ao deletar pedido" });
    }
};
