import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario/usuarioRoutes.js"
import pedidoRoutes from "./routes/pedido/pedidoRoutes.js"; 
import produtoRoutes from "./routes/produto/produtoRoutes.js"
import funcionarioRoutes from "./routes/funcionario/funcionarioRoutes.js"
import smsRoutes from "./routes/smsMfa/smsRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", usuarioRoutes); // CONFIGURADO E FUNCIONANDO NO FRONT
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/uploads", express.static("uploads")); // CONFIGURADO E FUNCIONANDO NO FRONT
app.use("/api/smsMfa", smsRoutes);

export default app;
