// services/produtoService.js
import prisma from "../../config/db.js";

// Criar um novo produto
export const criarProduto = async (dadosProduto) => {
    const { nome, descricao, preco, imagem, estoque, categoria } = dadosProduto;
    
    if (!nome || !descricao || !preco || !imagem || !categoria || estoque === undefined) {
        throw new Error("Todos os campos são obrigatórios!");
    }

    const estoqueInt = parseInt(estoque, 10);
    if (isNaN(estoqueInt)) {
        throw new Error("O campo 'estoque' deve ser um número válido!");
    }

    return await prisma.produto.create({
        data: {
            nome,
            descricao,
            preco: parseFloat(preco),
            imagem,
            estoque: estoqueInt,
            categoria,
        },
    });
};

// Listar todos os produtos
export const listarProdutos = async () => {
    return await prisma.produto.findMany();
};

// Buscar um produto por ID
export const buscarProdutoPorId = async (id) => {
    const produto = await prisma.produto.findUnique({ where: { id: Number(id) } });
    if (!produto) throw new Error("Produto não encontrado");
    return produto;
};

// Atualizar um produto
export const atualizarProduto = async (id, dadosAtualizados) => {
    const produtoExistente = await prisma.produto.findUnique({ where: { id: Number(id) } });
    if (!produtoExistente) throw new Error("Produto não encontrado");

    return await prisma.produto.update({
        where: { id: Number(id) },
        data: dadosAtualizados,
    });
};

// Deletar um produto
export const deletarProduto = async (id) => {
    const produtoExistente = await prisma.produto.findUnique({ where: { id: Number(id) } });
    if (!produtoExistente) throw new Error("Produto não encontrado");

    return await prisma.produto.delete({ where: { id: Number(id) } });
};
