import { useState } from "react";
import { useProductContext } from "../context/ProductContext";
import { FiTrash, FiX, FiPlus, FiMinus } from "react-icons/fi";
import CustomizacaoModal from "./CustomizacaoModal";

export default function CarrinhoModal({ onClose, onCheckout }) {
    const { cartItems, removeFromCart, updateQuantity } = useProductContext();
    const [cep, setCep] = useState("");
    const [frete, setFrete] = useState(null);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const total = cartItems.reduce((acc, item) => acc + (item.preco || 0) * (item.quantity || 1), 0);
    const totalComFrete = frete !== null ? total + frete : total;

    const calcularFrete = () => {
        if (cep.length === 8) {
            setFrete(10.0);
        } else {
            setFrete(null);
        }
    };

    const handleCustomize = (item) => {
        setSelectedItem(item);
        setShowCustomModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                    <FiX size={22} />
                </button>
                <h2 className="text-lg font-bold text-center mb-4">Seu Carrinho</h2>
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
                ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow">
                                <img src={item.imagem} alt={item.nome} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-1 ml-3">
                                    <p className="font-semibold text-sm">{item.nome}</p>
                                    <p className="text-xs text-gray-500">{item.produto}</p>
                                    {item.extras?.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            <strong>Extras:</strong> {item.extras.map((extra) => extra.nome).join(", ")}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-600 hover:text-red-500">
                                        <FiMinus size={18} />
                                    </button>
                                    <span className="font-bold">{item.quantity || 1}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-600 hover:text-green-500">
                                        <FiPlus size={18} />
                                    </button>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                                        <FiTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 p-3 rounded-lg bg-gray-100 shadow text-center">
                    {frete !== null && (
                        <p className="text-gray-700 text-sm">Frete: <strong>R$ {frete.toFixed(2)}</strong></p>
                    )}
                    <p className="text-lg font-bold text-gray-900">Total: R$ {totalComFrete.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-4 bg-gray-100 p-2 rounded-lg">
                    <input 
                        type="text" 
                        placeholder="Digite o CEP" 
                        value={cep} 
                        maxLength={8}
                        onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                        className="border-none bg-transparent flex-1 text-center"
                    />
                    <button onClick={calcularFrete} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        Calcular
                    </button>
                </div>
                {cartItems.length > 0 && (
                    <button onClick={onCheckout} className="w-full mt-4 bg-black text-white py-3 text-lg rounded-lg hover:bg-gray-800">
                        Finalizar Pedido
                    </button>
                )}
            </div>
            {showCustomModal && selectedItem && (
                <CustomizacaoModal item={selectedItem} onClose={() => setShowCustomModal(false)} />
            )}
        </div>
    );
}