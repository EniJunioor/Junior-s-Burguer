import express from "express";
import { enviarSms } from "../../services/smsService.js";

const router = express.Router();

router.post("/enviar-sms", enviarSms);

export default router;
