import { createContext, useState, useEffect, useContext } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // 🚀 Carregar produtos da API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/api/produtos");
        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json();
        console.log("Produtos carregados no contexto:", data);
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchData();
  }, []);

  // 🚀 Adicionar item ao carrinho corretamente
  const addToCart = (newItem) => {
    setCartItems((prevCart) => {
      if (!Array.isArray(prevCart)) prevCart = [];

      const existingIndex = prevCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.selectedPoint === newItem.selectedPoint &&
          item.observacoes === newItem.observacoes &&
          JSON.stringify(item.extras) === JSON.stringify(newItem.extras)
      );

      if (existingIndex !== -1) {
        // Se já existe no carrinho, aumenta a quantidade corretamente
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Caso seja um item novo, adiciona ao carrinho com quantity = 1
        return [...prevCart, { ...newItem, quantity: 1 }];
      }
    });
  };

  // 🚀 Remover item do carrinho
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🚀 Atualizar a quantidade de um item no carrinho
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(quantity, 0) } : item
        )
        .filter((item) => item.quantity > 0) // Remove se a quantidade for 0
    );
  };

  return (
    <ProductContext.Provider
      value={{
        produtos,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// 🚀 Criando e exportando a função `useProductContext`
export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext deve ser usado dentro de um ProductProvider");
  }
  return context;
}

export default ProductProvider;
