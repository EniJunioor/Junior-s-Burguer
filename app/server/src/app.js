import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import passport from "./config/passport.js";
import swaggerSpec from "./config/swaggerConfig.js";
import * as swaggerUi from "swagger-ui-express";

import usuarioRoutes from "./routes/usuario/usuarioRoutes.js";
import pedidoRoutes from "./routes/pedido/pedidoRoutes.js";
import produtoRoutes from "./routes/produto/produtoRoutes.js";
import funcionarioRoutes from "./routes/funcionario/funcionarioRoutes.js";
import mailRoutes from "./routes/mail/mailRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";

import { healthCheck } from "./controllers/misc/healthCheckController.js";

const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());
dotenv.config();

// Criar pasta de logs se não existir
const logDirectory = "logs";
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Configurar Morgan para salvar logs de requisições
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

// Middleware do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Corrigindo a rota de Health Check
app.get("/api/health", healthCheck); // Apenas GET para evitar conflitos

// Rotas principais
app.use("/api/users", usuarioRoutes); // Usuários
app.use("/api/pedidos", pedidoRoutes); // Pedidos
app.use("/api/produtos", produtoRoutes); // Produtos
app.use("/api/funcionarios", funcionarioRoutes); // Funcionários
app.use("/api/auth", mailRoutes); // Autenticação via e-mail
app.use("/auth", authRoutes); // Autenticação geral

// Servir arquivos estáticos
app.use("/uploads", express.static("uploads"));

// Middleware de erro para capturar problemas
app.use((err, req, res, next) => {
    console.error("❌ Erro detectado:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
});



export default app;
