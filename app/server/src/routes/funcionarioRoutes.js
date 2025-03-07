import express from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import { criarFuncionario, listarFuncionarios, editarFuncionario, excluirFuncionario } from "../controllers/funcionarioController.js";

const router = express.Router();

const verificarAdmin = (req, res, next) => {
    if (req.usuario?.role !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }
    next();
};

router.post("/", autenticarToken, verificarAdmin, criarFuncionario);
router.get("/", autenticarToken, verificarAdmin, listarFuncionarios);
router.patch("/:id", autenticarToken, verificarAdmin, editarFuncionario);
router.delete("/:id", autenticarToken, verificarAdmin, excluirFuncionario);

export default router;
