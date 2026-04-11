import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usuariosSchema = new Schema({
    rol:{
        type: String,
        required: true,
        enum: ["jefeTalentoHumano", "servidorPublico"]
    },
    nombres: {
        type: [String],
        required: true
    },
    numIdentificacion: {
        type: Number,
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
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    activo: {
        type: Boolean,
        default: true
    }

    }, {
        timestamps: true
    });

const usuarios = model("User", usuariosSchema);

export default usuarios;