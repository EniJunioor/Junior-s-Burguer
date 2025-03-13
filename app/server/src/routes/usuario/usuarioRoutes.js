import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import { limiteAutenticacao } from "../../middlewares/rateLimit.js"; 

import {
    loginUsuario,
    registrarUsuario,
    listarUsuarios,
    deletarUsuario
} from "../../controllers/usuario/usuarioController.js";

const router = express.Router();

router.post("/register", limiteAutenticacao, registrarUsuario); // REGISTRAR USUARIO
router.post("/login", limiteAutenticacao, loginUsuario); // LOGIN USUARIO

router.get("/", autenticarToken, listarUsuarios); // LISTAR USUÁRIOS
router.delete("/:id", autenticarToken, deletarUsuario); // DELETAR USUÁRIOS

export default router;
