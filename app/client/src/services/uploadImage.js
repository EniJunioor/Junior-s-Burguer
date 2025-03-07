import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadImage = async (file) => {
  if (!file) return null;

  const storage = getStorage();
  const storageRef = ref(storage, `produtos/${file.name}`);

  try {
    // Faz upload da imagem
    const snapshot = await uploadBytes(storageRef, file);

    // Obtém a URL da imagem após o upload
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("Imagem enviada com sucesso:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
    return null;
  }
};

export default uploadImage;
