import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
import { autenticarToken } from "../middlewares/authMiddleware.js";


export const registrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body; 

    try {
        console.log("🔍 Dados recebidos:", req.body);

        if (!nome || !email || !senha) {  
            
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const usuarioExistente = await prisma.usuario.findFirst({ where: { email } });
        if (usuarioExistente) {
            
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10); // Alterando "password" para "senha"
        

        const novoUsuario = await prisma.usuario.create({
            data: { nome, email, senha: senhaHash }
        });

        console.log("✅ Usuário criado com sucesso:", novoUsuario);
        res.status(201).json({ message: "Usuário criado!", user: { id: novoUsuario.id, email: novoUsuario.email } });
    } catch (error) {
        console.error("❌ Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro ao registrar usuário", details: error.message });
    }
};


export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
      console.log("📩 Dados recebidos para login:", req.body);

      if (!email || !senha) {
          return res.status(400).json({ message: "Email e senha são obrigatórios." });
      }

      // 🔥 Buscar usuário no banco
      const usuario = await prisma.usuario.findUnique({ where: { email } });

      console.log("🔍 Usuário encontrado:", usuario);

      if (!usuario) {
          return res.status(404).json({ message: "Usuário não encontrado." });
      }

      if (!usuario.senha) {
          return res.status(500).json({ message: "Erro no servidor: senha não encontrada." });
      }

      // 🔑 Testando a comparação da senha
      console.log("🔑 Senha digitada:", senha);
      console.log("🔒 Senha do banco:", usuario.senha);

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      console.log("🔄 Comparação de senha:", senhaCorreta);

      if (!senhaCorreta) {
          return res.status(401).json({ message: "Senha incorreta." });
      }

      // 🔑 Verificar se a chave secreta do JWT está carregada
      console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);
      if (!process.env.JWT_SECRET) {
          return res.status(500).json({ message: "Erro no servidor: chave JWT não configurada." });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login bem-sucedido!", token });
  } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      res.status(500).json({ message: "Erro ao processar login.", detalhes: error.message });
  }
};

  

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: { id: true, nome: true, email: true } // Exclui a senha por segurança
        });

        console.log("✅ Lista de usuários retornada!");
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("❌ Erro ao listar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

export const deletarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { id } });
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await prisma.usuario.delete({ where: { id } });

        console.log(`✅ Usuário ${id} deletado com sucesso!`);
        res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao deletar usuário:", error);
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
};
