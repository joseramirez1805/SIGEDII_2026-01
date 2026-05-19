import express from "express";
import { testConnection } from "./config/mongoDb.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import "./models/usuariosModel.js";
import hojaVidaRoutes from "./routes/hojaVidaRoutes.js";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
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

