export const buscarProdutos = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/produtos"); // Pegando do back-end
    if (!response.ok) throw new Error("Erro ao buscar produtos");

    const produtos = await response.json();
    console.log("✅ Produtos carregados:", produtos);
    return produtos;
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error.message);
    return [];
  }
};
