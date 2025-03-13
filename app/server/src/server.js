
import app from "./app.js";
import prisma from "./config/db.js";
import logger from "./config/logger.js";
import { connectRedis } from "./config/redisConfig.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
       logger.info("🔥 Conectado ao NeonDB PostgreSQL!");

        await connectRedis(); // ✅ Agora só conecta uma vez!

        app.listen(PORT, () => logger.info(`🚀 Servidor rodando na porta ${PORT}`));
    } catch (error) {
        logger.error("❌ Erro ao iniciar servidor:", error);
    }
};

startServer();
