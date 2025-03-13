import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Cardapio from "./pages/Cardapio";
import Header from "./components/Header";


function Layout() {
  
  return (
     
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/" element={<Header />} />
        
      </Routes>
  );
}


export default App;
