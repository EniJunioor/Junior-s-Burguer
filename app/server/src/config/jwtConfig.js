import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

export const gerarToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

export const verificarToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};
