import * as produtoService from "../produto/produtoService.js"


// Criar um novo produto
export const criarProduto = async (req, res) => {
    try {
        const novoProduto = await produtoService.criarProduto(req.body);
    res.status(201).json(novoProduto)
    } catch(error) {
        res.status(400).json({ error: error.message })
    }
};

// Listar todos os produtos
export const listarProdutos = async (req, res) => {
    try {
        const produtos = await produtoService.listarProdutos(req.body);
        res.status(200).json(produtos);
    } catch(error) {
        res.status(400).json({ error: error.message })
    }
};

// Buscar um produto por ID
export const buscarProdutoPorId = async (req, res) => {
    try{
        const produto = await produtoService.buscarProdutoPorId(req.params.id);
        res.status(200).json(produto);
    } catch(error) {
        res.status(400).json({error:error.message})
    }
};

// Atualizar um produto
export const atualizarProduto = async (req, res) => {
    try{
        const produtoAtualizado = await produtoService.atualizarProduto(req.params.id, req.body);
        res.status(200).json(produtoAtualizado);
    } catch(error) {
        res.status(400).json({error:error.message})
    }
};

// Deletar um produto
export const deletarProduto = async (req, res) => {
    try {
        await produtoService.deletarProduto(req.params.id);
        res.status(200).json({ message: "Produto deletado com sucesso!" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};