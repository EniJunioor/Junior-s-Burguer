
import app from "../src/app.js";  // Caminho correto para importar o Express

describe("Teste de Login", () => {
    it("Deve fazer login com usuário válido", async () => {
        const res = await request(app).post("/api/users/login").send({
            email: "admin@email.com",
            senha: "123456"
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    it("Deve falhar ao fazer login com senha errada", async () => {
        const res = await request(app).post("/api/users/login").send({
            email: "admin@email.com",
            senha: "senhaerrada"
        });
        expect(res.status).toBe(400);
    });
});
