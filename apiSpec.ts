import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WhiteBoard API",
      version: "1.0.0",
      description:
        "API documentation for file uploads with client-specific validation",
    },
    servers: [
      {
        url: "http://localhost:2000",
      },
    ],
  },
  apis: ["./routes/*.ts"], // ✅ updated path for your project structure
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
