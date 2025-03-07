import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useProductContext } from "../context/ProductContext";

export default function CustomizacaoModal({ item, onClose }) {
  const [selectedPoint, setSelectedPoint] = useState("");
  const [extras, setExtras] = useState({});
  const [observacoes, setObservacoes] = useState("");
  const { addToCart, cart, setCart } = useProductContext();

  const extrasList = [
    { id: 1, nome: "Queijo Extra", preco: 2.5 },
    { id: 2, nome: "Bacon", preco: 2.5 },
    { id: 3, nome: "Hambúrguer Adicional", preco: 2.5 },
  ];

  const changeQuantity = (extra, delta) => {
    setExtras((prevExtras) => {
      const newExtras = { ...prevExtras };
      newExtras[extra] = (newExtras[extra] || 0) + delta;
      if (newExtras[extra] <= 0) delete newExtras[extra];
      return newExtras;
    });
  };

  const removeExtra = (extra) => {
    setExtras((prevExtras) => {
      const newExtras = { ...prevExtras };
      delete newExtras[extra];
      return newExtras;
    });
  };

  const handleAddToCart = () => {
    const itemCustomizado = {
      id: item.id,
      name: item.nome,
      preco: item.preco || 0,
      image: item.imagem || "default_image_url.jpg",
      quantity: 1,
      selectedPoint: selectedPoint || "Padrão",
      extras: [],
      observacoes: observacoes.trim(),
    };

    Object.entries(extras).forEach(([nome, quantidade]) => {
      const extraInfo = extrasList.find((extra) => extra.nome === nome);
      if (extraInfo) {
        itemCustomizado.extras.push({
          id: extraInfo.id,
          nome,
          quantidade,
          preco: extraInfo.preco,
        });
      }
    });

    if (!Array.isArray(cart)) ([]);

    

    addToCart(itemCustomizado);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-7 rounded-lg shadow-lg w-96 md:w-[500px]">
        <div className="bg-red-600 text-white py-2 mb-9 rounded-lg opacity-90">
          <h2 className="text-lg font-bold text-center mb-1 mt-1">Personalize seu pedido</h2>
        </div>

        <h2 className="mt-4 font-semibold">Ponto da Carne:</h2>
        <div className="space-y-2">
          {["Malpassado", "Ao Ponto", "Bem Passado"].map((ponto) => (
            <div key={ponto} className="flex justify-between items-center border rounded-lg p-2">
              <span className="text-gray-700">{ponto}</span>
              <input
                type="radio"
                name="pontoCarne"
                value={ponto}
                checked={selectedPoint === ponto}
                onChange={() => setSelectedPoint(ponto)}
                className="form-radio text-red-600"
              />
            </div>
          ))}
        </div>

        <h3 className="mt-4 font-semibold">Extras:</h3>
        <div className="space-y-2 border rounded-lg">
          {extrasList.map(({ nome, preco }) => (
            <div key={nome} className="flex justify-between items-center rounded-lg p-2">
              <span className="text-gray-700">{nome} + R$ {preco.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <button className="text-red-500" onClick={() => changeQuantity(nome, -1)} disabled={!extras[nome]}>
                  <FaMinus />
                </button>
                <span>{extras[nome] || 0}</span>
                <button className="text-green-500" onClick={() => changeQuantity(nome, 1)}>
                  <FaPlus />
                </button>
                {extras[nome] && (
                  <button className="text-gray-500" onClick={() => removeExtra(nome)}>
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-4 font-semibold">Observações:</h3>
        <textarea
          className="w-full border rounded-lg p-2 text-gray-700"
          placeholder="Exemplo: Sem cebola, molho extra..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            Cancelar
          </button>
          <button onClick={handleAddToCart} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
