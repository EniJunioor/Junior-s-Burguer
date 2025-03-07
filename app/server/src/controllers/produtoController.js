import  prisma  from "../config/db.js"; 

export const criarProduto = async (req, res) => {
    try {
        const { nome, descricao, preco, imagem, estoque, categoria } = req.body;

        // Log para verificar se os dados estão chegando corretamente
        console.log("Recebendo novo produto:", req.body);

        // Verificação correta dos campos obrigatórios
        if (!nome || !descricao || !preco || !imagem || !categoria || estoque === undefined) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
        }

        // Convertendo `estoque` para número (caso venha como string)
        const estoqueInt = parseInt(estoque, 10);
        if (isNaN(estoqueInt)) {
            return res.status(400).json({ error: "O campo 'estoque' deve ser um número válido!" });
        }

        // Criar o produto no banco de dados
        const novoProduto = await prisma.produto.create({
            data: {
                nome,
                descricao,
                preco: parseFloat(preco), // Garantindo que o preço seja um número
                imagem,
                estoque: estoqueInt,
                categoria,
            },
        });

        console.log("Produto criado com sucesso:", novoProduto);
        return res.status(201).json(novoProduto);

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return res.status(500).json({ error: "Erro interno ao criar produto", details: error.message });
    }
};
// Listar todos os produtos
export const listarProdutos = async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();
        res.status(200).json(produtos);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).json({ error: "Erro ao listar produtos" });
    }
};

// Buscar um único produto por ID
export const buscarProdutoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await prisma.produto.findUnique({ where: { id } });

        if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

        res.status(200).json(produto);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({ error: "Erro ao buscar produto" });
    }
};

// Atualizar um produto
export const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, categoria } = req.body;

    try {
        const produtoExistente = await prisma.produto.findUnique({ where: { id } });
        if (!produtoExistente) return res.status(404).json({ error: "Produto não encontrado" });

        const produtoAtualizado = await prisma.produto.update({
            where: { id },
            data: { nome, descricao, preco, estoque, categoria }
        });

        res.status(200).json({ message: "Produto atualizado!", produto: produtoAtualizado });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
};

// Deletar um produto
export const deletarProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoExistente = await prisma.produto.findUnique({ where: { id } });
        if (!produtoExistente) return res.status(404).json({ error: "Produto não encontrado" });

        await prisma.produto.delete({ where: { id } });

        res.status(200).json({ message: "Produto deletado com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Erro ao deletar produto" });
    }
};
