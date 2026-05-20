import express from "express";
import { testConnection } from "./config/mongoDb.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import "./models/usuariosModel.js";
import hojaVidaRoutes from "./routes/hojaVidaRoutes.js";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/ErrorHandler.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const allowedOrigins = new Set(["http://localhost:5173", "http://localhost:5174"]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log("[CORS]", req.method, req.url, origin || "sin-origin");

  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "10mb" }));
app.use("/usuarios", usuariosRoutes);
app.use("/api/hoja-vida", hojaVidaRoutes);
app.use(errorHandler);



const serverConnection = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log("Corriendo en puerto " + port);
    });
  } catch (error) {
    console.log("Error al levantar el servidor, error: " + error.message);
  }
};

serverConnection();

