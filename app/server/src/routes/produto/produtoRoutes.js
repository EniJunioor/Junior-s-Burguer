import express from "express";
import multer from "multer";
import path from "path";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import {
    criarProduto,
    listarProdutos,
    buscarProdutoPorId,
    atualizarProduto,
    deletarProduto
} from "../../controllers/produto/produtoController.js";

const router = express.Router();


router.post("/", autenticarToken, criarProduto);
router.get("/", listarProdutos);
router.get("/:id", buscarProdutoPorId);
router.put("/:id", autenticarToken, atualizarProduto);
router.delete("/:id", autenticarToken, deletarProduto);

export default router;
