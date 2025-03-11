import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js"
import {
    loginUsuario,
    registrarUsuario,
    listarUsuarios,
    deletarUsuario
} from "../../controllers/usuario/usuarioController.js";
import { verificarCodigo } from "../../controllers/usuario/usurarioMfaController.js";

const router = express.Router();

router.post("/register", registrarUsuario); // REGISTRAR USUARIO
router.post("/login", loginUsuario); //LOGIN USUARIO
router.post("/verificar-codigo", verificarCodigo); // MFA USUARIO

router.get("/", autenticarToken, listarUsuarios); // LISTAR USUARIOS
router.delete("/:id", autenticarToken, deletarUsuario); // DELETAR USUARIOS

export default router;
