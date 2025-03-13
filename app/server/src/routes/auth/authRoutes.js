import express from "express";
import { renovarToken, logout } from "../../controllers/usuario/usuarioController.js";
import passport from "passport";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post("/token", renovarToken); // Renova o Access Token
router.post("/logout", logout); // Faz logout removendo o Refresh Token

// Rota para iniciar login com Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback do Google após autenticação
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Autenticado com sucesso!", token });
    }
);


export default router;
