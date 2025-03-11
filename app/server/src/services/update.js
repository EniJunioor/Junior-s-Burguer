const multer = require("multer");
const path = require("path");

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Arquivo não suportado"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
