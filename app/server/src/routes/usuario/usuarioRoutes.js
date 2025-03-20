import express from "express";
import { body, validationResult } from "express-validator";

import { autenticarToken } from "../../middlewares/authMiddleware.js";
import { limiteAutenticacao } from "../../middlewares/rateLimit.js"; 

import {
    loginUsuario,
    registrarUsuario,
    listarUsuarios,
    deletarUsuario,
    atualizarUsuario
} from "../../controllers/usuario/usuarioController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Endpoints para gerenciamento de Usuários
 */


/**
 * @swagger
 * components:
 *   security:
 *   - BearerAuth: []
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         senha:
 *           type: string
 *           description: Senha do usuário
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário no sistema.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro na validação dos dados
 */
router.post("/register", limiteAutenticacao, [
    body("nome").notEmpty().withMessage("O nome é obrigatório."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha").isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], registrarUsuario);

/**
 * @swagger
 *  /api/users/login:
 *   post:
 *     summary: Faz login do usuário
 *     description: Autentica o usuário e retorna um token JWT.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Erro na validação dos dados
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", limiteAutenticacao, [
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha").notEmpty().withMessage("A senha é obrigatória."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], loginUsuario);

/**
 * @swagger
 * /api/users/atualizar/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     description: Permite atualizar informações do usuário, como nome e email (requer autenticação).
 *     tags:
 *       - Usuários
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo email do usuário
 *               senha:
 *                 type: string
 *                 description: Nova senha do usuário (opcional)
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro na validação dos dados
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/atualizar/:id", autenticarToken, atualizarUsuario);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de usuários cadastrados (necessário autenticação).
 *     tags:
 *       - Usuários
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get("/", autenticarToken, listarUsuarios);

/**
 * @swagger
 *  /api/users/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     description: Remove um usuário do sistema (necessário autenticação).
 *     tags:
 *       - Usuários
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/:id", autenticarToken, deletarUsuario);

export default router;
