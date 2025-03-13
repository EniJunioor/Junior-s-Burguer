import winston from "winston";
import path from "path";

// Define os formatos de log
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

// Cria o logger
const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join("logs", "app.log") }),
    ],
});

// Middleware para capturar erros não tratados
process.on("uncaughtException", (err) => {
    logger.error(`Erro não tratado: ${err.message}`);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error(`Rejeição não tratada: ${reason}`);
});

export default logger;
