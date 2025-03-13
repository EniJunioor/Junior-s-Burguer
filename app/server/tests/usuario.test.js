import request from "supertest";
import app from "../src/app.js"; // Importa o app principal
import prisma from "../src/config/db.js"; // Importa o Prisma

// Antes de rodar os testes, limpamos o banco de dados de testes
beforeAll(async () => {
    await prisma.usuario.deleteMany(); // Limpa os usuários
});

// Após os testes, fecha a conexão com o banco de dados
afterAll(async () => {
    await prisma.$disconnect();
});

describe("Testes da API de Usuário", () => {
    it("Deve registrar um novo usuário", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({ nome: "Teste", email: "teste@email.com", senha: "123456" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Usuário criado!");
    });

    it("Deve impedir registro de e-mail duplicado", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({ nome: "Teste", email: "teste@email.com", senha: "123456" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "E-mail já cadastrado.");
    });

    it("Deve impedir login com credenciais erradas", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "teste@email.com", senha: "senhaErrada" });

        expect(res.statusCode).toBe(401);

        expect(res.body).toHaveProperty("error", "Senha incorreta");
    });
});
