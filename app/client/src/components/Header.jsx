import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logoburguer.png";
import { Menu, ShoppingBag, User, Utensils, LogOut, Moon } from "lucide-react";
import CarrinhoModal from "./CarrinhoModal"; 

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [status, setStatus] = useState("Carregando...");
  const [fadeIn, setFadeIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkRestaurantStatus();
    setTimeout(() => setFadeIn(true), 300);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function checkRestaurantStatus() {
    const hora = new Date().getHours();
    setStatus(hora >= 14 && hora < 23 ? "Aberto Agora" : "Fechado no Momento");
  }

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  return (
    <>
      <header className={`w-full h-[320px] bg-home bg-cover bg-center flex flex-col items-center justify-center transition-all duration-700 ease-out ${fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <div className="absolute top-3 left-3">
          <button onClick={toggleMenu} className="p-2 rounded-md text-white hover:bg-gray-700">
            <Menu size={20} />
          </button>
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={openCart} className="flex items-center gap-2 text-white font-bold bg-red-500 px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition-all md:px-4 md:py-2 md:text-base">
            <ShoppingBag size={18} />
            <span className="hidden md:inline">Ver Carrinho</span>
          </button>
        </div>
        <img src={logo} alt="Logo Junior Burguers" className="w-24 h-24 rounded-full shadow-lg hover:scale-110 duration-200" />
        <h1 className="text-2xl mt-2 font-bold text-white text-center transition-all duration-500 drop-shadow-lg">Junior Burguers</h1>
        <span className={`font-medium px-3 py-1 rounded-lg shadow-md transition-all text-white text-lg ${status === "Aberto Agora" ? "bg-green-500 text-green-200 drop-shadow-lg" : "bg-red-500 text-red-200 drop-shadow-lg"}`}>{status}</span>
      </header>

      <nav className={`fixed top-0 w-full bg-transparent/70 backdrop-blur-md shadow-md py-2 transition-all duration-500 z-50 ${isScrolled ? "translate-y-0 opacity-100 shadow-lg" : "-translate-y-full opacity-0"}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <button onClick={toggleMenu} className="p-2 rounded-md text-white hover:bg-gray-700">
            <Menu size={20} />
          </button>
          
          <button onClick={openCart} className="flex items-center gap-2 text-white font-bold bg-red-500 px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition-all md:px-4 md:py-2 md:text-base">
            <ShoppingBag size={18} />
            <span className="hidden md:inline">Ver Carrinho</span>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div 
        ref={menuRef} 
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-5 flex flex-col gap-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >      
          <button onClick={toggleMenu} className="text-gray-600 self-end">X</button>
          <nav className="flex flex-col gap-4">
            <button onClick={() => navigate("/perfil")} className="flex items-center gap-2 text-gray-700 hover:text-red-500">
              <User size={20} /> Perfil
            </button>
            <button onClick={openCart} className="flex items-center gap-2 text-gray-700 hover:text-red-500">
              <ShoppingBag size={20} /> Pedidos
            </button>
            <button onClick={() => navigate("/Cardapio")} className="flex items-center gap-2 text-gray-700 hover:text-red-500">
              <Utensils size={20} /> Cardápio
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-red-500">
              <Moon size={20} /> Dark Mode
            </button>
            <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-red-600 hover:text-red-800">
              <LogOut size={20} /> Sair
            </button>
          </nav>
        </div>
      )}

      {isCartOpen && <CarrinhoModal onClose={closeCart} />} 
    </>
  );
}
