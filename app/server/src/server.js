import app from "./app.js";
import prisma from "./config/db.js";
import { connectRedis } from "./config/redisConfig.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("🔥 Conectado ao NeonDB PostgreSQL!");

        await connectRedis(); // ✅ Agora só conecta uma vez!

        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
    }
};

startServer();
