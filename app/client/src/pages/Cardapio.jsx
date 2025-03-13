import React, { useState, useEffect, useRef } from "react";
import { buscarProdutos } from "../services/firebaseService";
;

export default function Menu({ addToCart: propAddToCart }) {
  const { addToCart: contextAddToCart } = useProductContext();
  const addToCart = propAddToCart || contextAddToCart; // Usa a prop se existir, senão usa o contexto

  const categories = ["Combos", "Promoções", "Hambúrgueres", "Porções", "Bebidas", "Sobremesas"];
  const [activeCategory, setActiveCategory] = useState("Hambúrgueres");
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState({
    Combos: [],
    Promoções: [],
    Hambúrgueres: [],
    Porções: [],
    Bebidas: [],
    Sobremesas: []
  });

  const categoryRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const produtos = await buscarProdutos();
        console.log("✅ Produtos carregados:", produtos);

        produtos.forEach((produto) => {
          console.log(`🔎 Produto: ${produto.nome}, Categoria: '${produto.categoria}'`);
        });

        const normalizedCategories = {
          "HAMBURGUER": "Hambúrgueres",
          "COMBOS": "Combos",
          "PROMOÇÕES": "Promoções",
          "PORÇÕES": "Porções",
          "BEBIDA": "Bebidas",
          "SOBREMESAS": "Sobremesas"
        };

        const formattedItems = categories.reduce((acc, category) => {
          acc[category] = produtos.filter(produto => {
            const categoriaFormatada = produto.categoria?.trim().toUpperCase();
            return normalizedCategories[categoriaFormatada] === category;
          });
          return acc;
        }, { Combos: [], Promoções: [], Hambúrgueres: [], Porções: [], Bebidas: [], Sobremesas: [] });

        console.log("📦 Itens organizados por categoria:", formattedItems);
        setItems(formattedItems);
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
      }
    }

    carregarProdutos();
  }, []);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (categoryRef.current) {
        event.preventDefault();
        categoryRef.current.scrollLeft += event.deltaY * 1.5;
      }
    };

    const categoryElement = categoryRef.current;
    if (categoryElement) {
      categoryElement.addEventListener("wheel", handleWheelScroll, { passive: false });
    }

    return () => {
      if (categoryElement) {
        categoryElement.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  const handleMouseDown = (event) => {
    isDragging.current = true;
    startX.current = event.pageX - categoryRef.current.offsetLeft;
    scrollLeft.current = categoryRef.current.scrollLeft;
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    event.preventDefault();
    const x = event.pageX - categoryRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    categoryRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
      <div
        className="w-full overflow-x-auto scrollbar-hide cursor-grab px-4 sm:flex sm:justify-center"
        ref={categoryRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-2 sm:gap-4 px-5 py-3 w-max">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`whitespace-nowrap px-4 sm:px-6 py-2.5 min-w-[80px] sm:min-w-[100px] rounded-lg transition-all text-xs sm:text-base font-semibold ${activeCategory === category ? "bg-red-500 text-white shadow-md scale-105 border-2 border-red-700" : "bg-gray-200 hover:bg-gray-400"
                }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <main className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items[activeCategory]?.length > 0 ? (
          items[activeCategory].map((produto, index) => (
            <div key={index} className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 flex flex-col items-center text-center transform hover:scale-[1.02] duration-300">
              <img
                src={produto.imagem || "https://via.placeholder.com/100"}
                alt={produto.nome || "Produto sem imagem"}
                className="w-24 sm:w-28 h-24 sm:h-28 rounded-md hover:scale-105 duration-300"
              />
              <p className="font-semibold text-lg sm:text-xl text-gray-900 mt-2">{produto.nome}</p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">{produto.descricao}</p>
              <div className="flex items-center justify-between w-full mt-3 px-4">
                <p className="text-base sm:text-lg font-bold text-green-700">R$ {produto.preco.toFixed(2)}</p>
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg transition-all shadow-md hover:brightness-110"
                  onClick={() => setSelectedItem(produto)}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg col-span-full">Nenhum produto disponível nesta categoria.</p>
        )}
      </main>

      {selectedItem && (
        <CustomizacaoModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={(customizedItem) => {
            addToCart(customizedItem);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
