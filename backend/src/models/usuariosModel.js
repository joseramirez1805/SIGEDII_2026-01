import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usuariosSchema = new Schema({
    rol:{
        type: String,
        required: true,
        enum: ["jefeTalentoHumano", "servidorPublico"]
    },
    contrasena:{
        type: String,
        required: true,
        minlength: 6
    },
    nombres: {
        type: [String],
        required: true
    },
    numIdentificacion: {
        type: String,
        required: true,
        unique: true
    },
    tipoDocumento: {
        type: String,
        required: true,
        enum: ["cedulaCiudadania", "cedulaExtranjera", "pasaporte"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }

    }, {
        timestamps: true,
        collection: "usuarios"
    });

const usuarios = model("Usuario", usuariosSchema, "usuarios");

export default usuarios;