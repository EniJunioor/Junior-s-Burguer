import express from "express";
import { body, validationResult } from "express-validator";

import { autenticarToken } from "../../middlewares/authMiddleware.js";
import { limiteAutenticacao } from "../../middlewares/rateLimit.js"; 

import {
    loginUsuario,
    registrarUsuario,
    listarUsuarios,
    deletarUsuario
} from "../../controllers/usuario/usuarioController.js";

const router = express.Router();

// Middleware para validar os inputs
const validarUsuario = [
    body("nome").notEmpty().withMessage("O nome é obrigatório."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha").isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware para validar a senha
const validarLogin = [
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha").notEmpty().withMessage("A senha é obrigatória."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.post("/register", limiteAutenticacao, validarUsuario, registrarUsuario); // REGISTRAR USUARIO
router.post("/login", limiteAutenticacao, validarLogin, loginUsuario); // LOGIN USUARIO

router.get("/", autenticarToken, listarUsuarios); // LISTAR USUÁRIOS
router.delete("/:id", autenticarToken, deletarUsuario); // DELETAR USUÁRIOS

export default router;