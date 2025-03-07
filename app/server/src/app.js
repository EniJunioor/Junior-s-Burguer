import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js"; 
import produtoRoutes from "./routes/produtoRoutes.js"
import funcionarioRoutes from "./routes/funcionarioRoutes.js"

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", usuarioRoutes); // CONFIGURADO E FUNCIONANDO NO FRONT
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/uploads", express.static("uploads")); // CONFIGURADO E FUNCIONANDO NO FRONT


export default app;
