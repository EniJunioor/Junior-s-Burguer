import express from "express";
import { healthCheck, statusCheck } from "../../controllers/misc/healthCheckController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: HealthCheck
 *     description: Endpoints para verificação de status do servidor
 */


/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica o status da API
 *     description: Retorna um status indicando que a API está funcionando corretamente.
 *     tags:
 *       - HealthCheck
 *     responses:
 *       200:
 *         description: API está funcionando normalmente
 */
router.get("/health", healthCheck);

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Verifica o status do servidor
 *     description: Retorna um status detalhado do servidor.
 *     tags:
 *       - HealthCheck
 *     responses:
 *       200:
 *         description: Status do servidor retornado com sucesso
 */
router.get("/status", statusCheck);

export default router;