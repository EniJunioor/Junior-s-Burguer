import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/Logoburguer.png";
import axios from "../services/api";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      console.error("⚠ Campos vazios detectados!");
      return alert("Preencha todos os campos.");
    }

    if (!isLogin && senha !== confirmSenha) {
      console.error("⚠ Senhas não coincidem!");
      return alert("As senhas não coincidem.");
    }

    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin
      ? { email, senha }
      : { nome, email, senha, confirmarSenha: confirmSenha };

    console.log(`📩 Enviando dados para /${endpoint}:`, payload);

    try {
      const response = await axios.post(`http://localhost:5000/api/users/${endpoint}`, payload);

      console.log("✅ Resposta do servidor:", response.data);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        navigate("/Cardapio"); // Redireciona para o cardápio após login
      } else {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        setIsLogin(true);
        navigate("/login"); // Agora redireciona para login após cadastro
      }
    } catch (error) {
      console.error("❌ Erro na requisição:", error.response?.data || error);
      alert(error.response?.data?.message || "Erro ao processar a requisição.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex items-center justify-center w-1/2 bg-primary rounded-lg p-2">
          <img src={logo} alt="Login" className="w-3/4 animate-fadeIn" />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fadeIn">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <form className="flex flex-col gap-4 w-full animate-slideIn" onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Nome Completo"
                className="input-field"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="E-mail"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              className="input-field"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirmar Senha"
                className="input-field"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                required
              />
            )}

            {isLogin && (
              <a href="#" className="text-sm text-red-500 hover:underline self-center">
                Esqueceu a senha?
              </a>
            )}

            <button type="submit" className="btn-primary transition-all duration-300 hover:scale-105">
              {isLogin ? "Entrar" : "Cadastrar"}
            </button>
          </form>

          <button className="btn-google mt-4 transition-all duration-300 hover:scale-105">
            <FcGoogle className="text-2xl mr-2" />
            {isLogin ? "Entrar com Google" : "Cadastrar com Google"}
          </button>

          <p className="mt-4 text-gray-600 text-sm">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 font-bold ml-1 hover:underline"
            >
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
