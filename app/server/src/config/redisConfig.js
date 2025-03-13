import { createClient } from "redis";
import dotenv from "dotenv";
import logger from "../config/logger.js"; 

dotenv.config();

const client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        reconnectStrategy: (retries) => {
           logger.info(`♻️ Tentando reconectar ao Redis (${retries} tentativas)`);
            return Math.min(retries * 100, 3000); 
        }
    }
});

let isConnected = false;

async function connectRedis() {
    if (!isConnected) {
        try {
            await client.connect();
            logger.info("🔴 Conectado ao Redis!");
            isConnected = true;
        } catch (err) {
            logger.error("❌ Erro ao conectar ao Redis:", err);
        }
    }
}

client.on("error", (err) => console.error("❌ Redis Client Error:", err));
client.on("end", () => {
    logger.warn("⚠️ Conexão com Redis encerrada! Tentando reconectar...");
    isConnected = false;
    connectRedis();
});

export { client, connectRedis };
export default client;
