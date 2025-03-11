import express from "express";
import { autenticarToken } from "../../middlewares/authMiddleware.js";
import validate from "../../validations/validate.js";
import createPedidoSchema from "../../validations/createPedido.dto.js";
import {
    criarPedido,
    listarPedidosUsuario,
    atualizarStatusPedido,
    deletarPedido
} from "../../controllers/pedido/pedidoController.js";

const router = express.Router();

router.post("/", autenticarToken, validate(createPedidoSchema), criarPedido);
router.get("/", autenticarToken, listarPedidosUsuario);
router.patch("/:id", autenticarToken, atualizarStatusPedido);
router.delete("/:id", autenticarToken, deletarPedido);

export default router;
