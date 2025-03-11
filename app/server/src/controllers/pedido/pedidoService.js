// services/pedidoService.js
import prisma from "../../config/db.js";

// Criar um novo pedido
export const criarPedido = async (cliente, itens, usuarioId) => {
    return await prisma.pedido.create({
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
};

// Atualizar status do pedido
export const atualizarStatusPedido = async (id, status, usuarioId, isAdmin) => {
    const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) } });
    if (!pedido) throw new Error("Pedido não encontrado");

    if (pedido.usuarioId !== usuarioId && !isAdmin) {
        throw new Error("Apenas o dono do pedido ou um administrador pode atualizar o status");
    }

    return await prisma.pedido.update({ where: { id: Number(id) }, data: { status } });
};

// Listar pedidos do usuário autenticado
export const listarPedidosUsuario = async (usuarioId) => {
    return await prisma.pedido.findMany({ where: { usuarioId } });
};

// Deletar pedido
export const deletarPedido = async (id, usuarioId, isAdmin) => {
    const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) } });
    if (!pedido) throw new Error("Pedido não encontrado");

    if (pedido.usuarioId !== usuarioId && !isAdmin) {
        throw new Error("Apenas o dono do pedido ou um administrador pode deletar o pedido");
    }

    await prisma.itemPedido.deleteMany({ where: { pedidoId: Number(id) } }); // Remove os itens primeiro
    return await prisma.pedido.delete({ where: { id: Number(id) } });
};
