import express from 'express';
import { requestMFA } from "../../controllers/auth/authController.js";

const router = express.Router();

router.post('/mfa/request', requestMFA);

export default router;
