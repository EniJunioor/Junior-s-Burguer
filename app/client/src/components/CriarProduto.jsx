import React, { useState } from "react";
import uploadImage from "../services/uploadImage.js";
import { useNavigate } from "react-router-dom";

const CriarProduto = ({ onProductCreated }) => {
    
    const [imagemUrl, setImagemUrl] = useState("");
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("Hambúrgueres");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (event) => {
        setImagem(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!imagem) return alert("Selecione uma imagem primeiro!");

        setLoading(true);
        try {
            const url = await uploadImage(imagem);
            setImagemUrl(url);
            alert("Imagem enviada com sucesso!");
        } catch (error) {
            console.error("Erro no upload da imagem:", error);
            alert("Erro ao enviar imagem.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!imagemUrl) return alert("Envie a imagem antes de criar o produto!");

        const produto = {
            nome,
            descricao,
            preco: parseFloat(preco),
            categoria,
            estoque,
            imagemUrl, // Agora enviamos a URL da imagem em vez do arquivo
        };

        try {
            const response = await fetch("http://localhost:5000/api/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produto),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar produto");
            }

            const data = await response.json();
            onProductCreated(data);
            alert("Produto criado com sucesso!");
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao criar produto.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-md bg-gray-50">
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do Produto" required />
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" required />
            <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Preço" required />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Combos">Combos</option>
                <option value="Promoções">Promoções</option>
                <option value="Hambúrgueres">Hambúrgueres</option>
                <option value="Porções">Porções</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Sobremesas">Sobremesas</option>
            </select>

            {/* Upload da Imagem */}
            <input type="file" onChange={handleImageChange} required />
            <button type="button" onClick={handleUpload} disabled={loading}>
                {loading ? "Enviando..." : "Enviar Imagem"}
            </button>

            {/* Mostrar a imagem após upload */}
            {imagemUrl && <img src={imagemUrl} alt="Prévia" style={{ width: 200, marginTop: 10 }} />}

            <button type="submit" disabled={!imagemUrl}>Criar Produto</button>
        </form>
    );
};

export default CriarProduto;
