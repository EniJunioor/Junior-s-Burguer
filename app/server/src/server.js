import app from "./app.js";
import prisma from "./config/db.js";

const PORT = process.env.PORT || 5000;

prisma.$connect().then(() => {
    console.log("🔥 Conectado ao NeonDB PostgreSQL!");
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
