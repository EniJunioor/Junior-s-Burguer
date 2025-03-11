import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import { 
    criarFuncionarioController, 
    listarFuncionariosController, 
    editarFuncionarioController, 
    excluirFuncionarioController 
} from "../../controllers/funcionario/funcionarioController.js";

const router = express.Router();

const verificarAdmin = (req, res, next) => {
    if (req.usuario?.role !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }
    next();
};

router.post("/", autenticarToken, verificarAdmin, criarFuncionarioController);
router.get("/", autenticarToken, verificarAdmin, listarFuncionariosController);
router.patch("/:id", autenticarToken, verificarAdmin, editarFuncionarioController);
router.delete("/:id", autenticarToken, verificarAdmin, excluirFuncionarioController);

export default router;
