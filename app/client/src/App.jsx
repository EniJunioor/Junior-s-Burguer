import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext"; 
import Login from "./pages/Login";
import Cardapio from "./pages/Cardapio";
import Header from "./components/Header";
i

function Layout() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login"];

  return (
    <ProductProvider> 
      {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cardapio" element={<Cardapio />} />
        
      </Routes>
    </ProductProvider>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
