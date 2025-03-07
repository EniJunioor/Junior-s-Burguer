import express from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import {
    loginUsuario,
    registrarUsuario,
    listarUsuarios,
    deletarUsuario
    
} from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/", autenticarToken, listarUsuarios); 
router.delete("/:id", autenticarToken, deletarUsuario);

export default router;
