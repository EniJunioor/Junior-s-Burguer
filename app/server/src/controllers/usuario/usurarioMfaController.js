import redis from "../../config/redisConfig.js";

export const verificarCodigo = async (req, res) => {
    const { telefone, codigoDigitado } = req.body;

    try {
        console.log(`📥 Recebendo requisição: telefone=${telefone}, codigoDigitado=${codigoDigitado}`);

        // Buscar código salvo no Redis
        const codigoSalvo = await redis.get(`mfa:${telefone}`);

        console.log(`📦 Código salvo no Redis: ${codigoSalvo}`);

        if (!codigoSalvo) {
            console.error("⚠️ Código expirado ou não encontrado no Redis");
            return res.status(401).json({ error: "Código expirado ou inválido" });
        }

        if (codigoDigitado !== codigoSalvo) {
            console.error("❌ Código incorreto");
            return res.status(401).json({ error: "Código inválido" });
        }

        // Remover código do Redis após verificação bem-sucedida
        await redis.del(`mfa:${telefone}`);
        console.log("✅ Código validado com sucesso!");

        res.status(200).json({ message: "Código válido. Login autorizado!" });
    } catch (error) {
        console.error("🔥 Erro ao verificar código:", error);
        res.status(500).json({ error: "Erro ao verificar código" });
    }
};
