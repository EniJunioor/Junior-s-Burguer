import express from "express";
import { requestMFA } from "../../controllers/auth/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/mfa/request:
 *   post:
 *     summary: Solicita MFA (Autenticação Multifator)
 *     description: Envia um código de autenticação multifator para o usuário.
 *     tags:
 *       - Autenticação
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
 *                 description: Email do usuário para receber o código MFA
 *     responses:
 *       200:
 *         description: Código MFA enviado com sucesso
 *       400:
 *         description: Requisição inválida
 */
router.post("/mfa/request", requestMFA);

export default router;
