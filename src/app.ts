import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import productcatalogRoutes from "./routes/productcatalogRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products CRUD API",
      version: "1.0.0",
      description:
        "A simple Products CRUD API with Express, TypeScript, and MongoDB",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // ✅ Make sure productRoutes.ts is documented
};

const swaggerUiOptions = {
  customSiteTitle: "Products API Docs",
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timeStamp: new Date().toISOString() });
});


app.use("/api/productcatalog", productcatalogRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server is running at http://localhost:${PORT}`);
      console.log(` Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
