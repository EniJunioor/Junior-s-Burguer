import express from "express";
import session from "express-session";
import cors from "cors";

import usuarioRoutes from "./routes/usuario/usuarioRoutes.js"
import pedidoRoutes from "./routes/pedido/pedidoRoutes.js"; 
import produtoRoutes from "./routes/produto/produtoRoutes.js"
import funcionarioRoutes from "./routes/funcionario/funcionarioRoutes.js"

import mailRoutes from "./routes/mail/mailRoutes.js"

import morgan from "morgan";
import logger from "./config/logger.js";
import fs from "fs";
import authRoutes from "./routes/auth/authRoutes.js";
import path from "path";
import { healthCheck } from "./controllers/misc/healthCheckController.js";
import passport from "./config/passport.js";




const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());

// Criar pasta de logs se não existir
const logDirectory = "logs";
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Configurar Morgan para salvar logs de requisições
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

// Rotas
app.use("/api", healthCheck); // Health Check
app.use("/api/users", usuarioRoutes); // Usuários
app.use("/api/pedidos", pedidoRoutes); // Pedidos
app.use("/api/produtos", produtoRoutes); // Produtos
app.use("/api/funcionarios", funcionarioRoutes); // Funcionários
app.use("/uploads", express.static("uploads")); // Servir arquivos estáticos
app.use("/api/auth", mailRoutes); // Autenticação via e-mail
app.use("/auth", authRoutes); // Autenticação geral


export default app;
