import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Função para salvar ou buscar o usuário no banco de dados
const salvarOuBuscarUsuario = async (profile, done) => {
    try {
        let usuario = await prisma.usuario.findUnique({
            where: { email: profile.emails[0].value },
        });

        if (!usuario) {
            usuario = await prisma.usuario.create({
                data: {
                    nome: profile.displayName,
                    email: profile.emails[0].value,
                    senha: "", // Como é OAuth, não precisamos de senha
                },
            });
        }

        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
};

// Configuração do Google OAuth
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            return salvarOuBuscarUsuario(profile, done);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await prisma.usuario.findUnique({ where: { id } });
        done(null, usuario);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
