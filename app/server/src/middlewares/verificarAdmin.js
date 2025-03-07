export const verificarAdmin = (req, res, next) => {
    console.log("Usuário autenticado:", req.usuario); // Mostra os dados do usuário no terminal
    if (!req.usuario || req.usuario.role !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }
    next();
};
