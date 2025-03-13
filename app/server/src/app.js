import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario/usuarioRoutes.js"
import pedidoRoutes from "./routes/pedido/pedidoRoutes.js"; 
import produtoRoutes from "./routes/produto/produtoRoutes.js"
import funcionarioRoutes from "./routes/funcionario/funcionarioRoutes.js"
import mailRoutes from "./routes/mail/mailRoutes.js"
import morgan from "morgan";
import logger from "./config/logger.js";
import fs from "fs";
import path from "path";
import { healthCheck } from "./controllers/misc/healthCheckController.js";

const app = express();
app.use(express.json());
app.use(cors());

// Criar pasta de logs se não existir
if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

// Configurar Morgan para salvar logs de requisições
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev")); 

app.use("/api", healthCheck); // HEALTH CHECK


app.use("/api/users", usuarioRoutes); // CONFIGURADO E FUNCIONANDO NO FRONT
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/uploads", express.static("uploads")); // CONFIGURADO E FUNCIONANDO NO FRONT
app.use('/api/auth', mailRoutes); // CONFIGURADO E FUNCIONANDO

export default app;
