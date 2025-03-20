import express from "express";
import { renovarToken, logout } from "../../controllers/usuario/usuarioController.js";
import { forgotPassword, resetPassword } from "../../controllers/auth/passawordController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints para autenticação e recuperação de senha
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitação de redefinição de senha
 *     description: Envia um email com um link para redefinição de senha.
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
 *                 description: Email do usuário
 *     responses:
 *       200:
 *         description: Email enviado com sucesso
 *       400:
 *         description: Erro ao processar solicitação
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha
 *     description: Permite que o usuário redefina sua senha com um token válido.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de redefinição de senha
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha do usuário
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Renovação do token JWT
 *     description: Gera um novo token de acesso a partir do refresh token.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token do usuário
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *       403:
 *         description: Refresh token inválido
 */
router.post("/token", renovarToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout do usuário
 *     description: Revoga o refresh token do usuário.
 *     tags:
 *       - Autenticação
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       400:
 *         description: Erro ao processar logout
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Iniciar login com Google
 *     description: Redireciona o usuário para autenticação via Google.
 *     tags:
 *       - Autenticação
 *     responses:
 *       302:
 *         description: Redirecionamento para autenticação do Google
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback do Google
 *     description: Callback para processar a autenticação via Google.
 *     tags:
 *       - Autenticação
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       401:
 *         description: Falha na autenticação
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Autenticado com sucesso!", token });
    }
);

export default router;
