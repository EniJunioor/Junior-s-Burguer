import rateLimit from "express-rate-limit";

// Limite de requisições por IP
export const limiteAutenticacao = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo de 5 tentativas por IP
    message: { error: "Muitas tentativas. Tente novamente mais tarde." },
    standardHeaders: true, 
    legacyHeaders: false, 
});
