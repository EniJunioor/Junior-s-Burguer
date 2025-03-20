import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Junior's Burguer API",
      version: "1.0.0",
      description: "Documentação da API do Junior's Burguer",
    },
    servers: [
      {
        url: "http://localhost:5000", 
        
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: []}],
  },
  apis: ["./routes/**/*.js"] , // Caminho dos arquivos de rotas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
