import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = usuario;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ error: "Token expirado. Faça login novamente." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ error: "Token inválido." });
        }
        console.error("❌ Erro ao verificar token:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};
