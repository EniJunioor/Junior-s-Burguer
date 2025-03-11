import * as usuarioService from "../usuario/usuarioService.js";
import { enviarSms } from "../../services/smsService.js";
import redis from "../../config/redisConfig.js"; 


// Registrar um novo usuário
export const registrarUsuario = async (req, res) => {
    try {
        const novoUsuario = await usuarioService.registrarUsuario(req.body);
        res.status(201).json({ message: "Usuário criado!", user: { id: novoUsuario.id, email: novoUsuario.email } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login de usuário
export const loginUsuario = async (req, res) => {
    const { email, senha, telefone } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        // Salvar no Redis com expiração de 5 minutos
        await redis.set(`mfa:${telefone}`, codigo, { EX: 300 });

        // Enviar SMS
        const smsEnviado = await enviarSms(telefone, codigo);
        if (!smsEnviado) {
            return res.status(500).json({ error: "Erro ao enviar código" });
        }

        res.status(200).json({ message: "Código enviado" });

    } catch (error) {
        res.status(500).json({ error: "Erro no login" });
    }
};


// Listar usuários
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

// Deletar usuário
export const deletarUsuario = async (req, res) => {
    try {
        const resultado = await usuarioService.deletarUsuario(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
