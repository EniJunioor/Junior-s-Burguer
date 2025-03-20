import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import validate from "../../validations/validate.js";
import createPedidoSchema from "../../validations/createPedido.dto.js";
import {
    criarPedido,
    listarPedidosUsuario,
    atualizarStatusPedido,
    deletarPedido
} from "../../controllers/pedido/pedidoController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Endpoints para gerenciamento de Pedidos
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - produtos
 *         - total
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         produtos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               produtoId:
 *                 type: string
 *                 description: ID do produto
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade do produto no pedido
 *         total:
 *           type: number
 *           description: Valor total do pedido
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     description: Adiciona um novo pedido ao sistema (requer autenticação).
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post("/", autenticarToken, validate(createPedidoSchema), criarPedido);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Lista os pedidos do usuário
 *     description: Retorna uma lista de pedidos do usuário autenticado.
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get("/", autenticarToken, listarPedidosUsuario);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     description: Permite atualizar o status de um pedido existente (requer autenticação).
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Novo status do pedido
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 */
router.patch("/:id", autenticarToken, atualizarStatusPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Deleta um pedido pelo ID
 *     description: Remove um pedido do sistema (requer autenticação).
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser deletado
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:id", autenticarToken, deletarPedido);

export default router;
