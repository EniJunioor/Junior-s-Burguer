import twilio from "twilio";
import { client as redis } from "../config/redisConfig.js";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const enviarSms = async (req, res) => {
    const { telefone } = req.body;
    if (!telefone) return res.status(400).json({ error: "Número de telefone obrigatório" });

    const codigo = Math.floor(100000 + Math.random() * 900000);
    await redis.set(`mfa:${telefone}`, codigo, { EX: 300 });

    try {
        console.log("🔍 TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
        console.log("🔍 TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
        console.log("🔍 TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);
        console.log("🔍 Telefone de destino:", telefone);

        const message = await twilioClient.messages.create({
            body: `Seu código: ${codigo}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: telefone,
        });

        console.log("✅ SMS enviado com sucesso! SID:", message.sid);
        res.json({ message: "SMS enviado!", sid: message.sid });
    } catch (error) {
        console.error("🔥 Erro ao enviar SMS:", error);
        res.status(500).json({ error: error.message }); // Retorna erro real
    }
};
