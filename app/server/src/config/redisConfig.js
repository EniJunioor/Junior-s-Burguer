import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

let isConnected = false;

async function connectRedis() {
    if (!isConnected) {
        await client.connect();
        console.log("🔴 Conectado ao Redis!");
        isConnected = true;
    }
}

client.on("error", (err) => console.error("❌ Redis Client Error:", err));

export { client, connectRedis };
export default client