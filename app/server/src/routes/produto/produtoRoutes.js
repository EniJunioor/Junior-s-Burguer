import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import {
    criarProduto,
    listarProdutos,
    buscarProdutoPorId,
    atualizarProduto,
    deletarProduto
} from "../../controllers/produto/produtoController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Endpoints para gerenciamento de Produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - preco
 *         - descricao
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         preco:
 *           type: number
 *           description: Preço do produto
 *         descricao:
 *           type: string
 *           description: Descrição do produto
 */

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     description: Adiciona um novo produto ao sistema (requer autenticação).
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post("/", autenticarToken, criarProduto);

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista de produtos cadastrados.
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
router.get("/", listarProdutos);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     description: Retorna os detalhes de um produto específico.
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser buscado
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.get("/:id", buscarProdutoPorId);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     description: Permite atualizar as informações de um produto (requer autenticação).
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.put("/:id", autenticarToken, atualizarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Deleta um produto pelo ID
 *     description: Remove um produto do sistema (requer autenticação).
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser deletado
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.delete("/:id", autenticarToken, deletarProduto);

export default router;