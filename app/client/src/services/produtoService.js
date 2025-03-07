import { db } from "./firebase"; // Certifique-se de que tem um arquivo firebase.js configurado
import { collection, addDoc, getDocs } from "firebase/firestore";  

// Adiciona um novo produto ao Firestore
export const criarProduto = async (produto) => {
  try {
    const docRef = await addDoc(collection(db, "produtos"), produto);
    console.log("Produto adicionado com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return null;
  }
};

// Busca todos os produtos no Firestore
export const buscarProdutos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const produtos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return produtos;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};
