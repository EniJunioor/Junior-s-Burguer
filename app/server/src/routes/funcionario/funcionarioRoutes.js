import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import { 
    criarFuncionarioController, 
    listarFuncionariosController, 
    editarFuncionarioController, 
    excluirFuncionarioController 
} from "../../controllers/funcionario/funcionarioController.js";

const router = express.Router();

const verificarAdmin = (req, res, next) => {
    if (req.usuario?.role !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }
    next();
};

/**
 * @swagger
 * tags:
 *   - name: Funcionários
 *     description: Endpoints para gerenciamento de funcionários
 */

/**
 * @swagger
 * /api/funcionarios:
 *   post:
 *     summary: Cria um novo funcionário
 *     description: Apenas administradores podem adicionar funcionários.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do funcionário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do funcionário
 *               role:
 *                 type: string
 *                 enum: [ADMIN, FUNCIONARIO]
 *                 description: Cargo do funcionário
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post("/", autenticarToken, verificarAdmin, criarFuncionarioController);

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     summary: Lista todos os funcionários
 *     description: Apenas administradores podem visualizar a lista de funcionários.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de funcionários retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get("/", autenticarToken, verificarAdmin, listarFuncionariosController);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   patch:
 *     summary: Edita um funcionário
 *     description: Apenas administradores podem editar funcionários.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do funcionário a ser editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do funcionário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo email do funcionário
 *               role:
 *                 type: string
 *                 enum: [ADMIN, FUNCIONARIO]
 *                 description: Novo cargo do funcionário
 *     responses:
 *       200:
 *         description: Funcionário atualizado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.patch("/:id", autenticarToken, verificarAdmin, editarFuncionarioController);

/**
 * @swagger
 * /api/funcionarios/{id}:
 *   delete:
 *     summary: Exclui um funcionário
 *     description: Apenas administradores podem excluir funcionários.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do funcionário a ser excluído
 *     responses:
 *       200:
 *         description: Funcionário excluído com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete("/:id", autenticarToken, verificarAdmin, excluirFuncionarioController);

export default router;
