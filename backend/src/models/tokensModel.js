import mongoose from "mongoose";

const { Schema, model } = mongoose;

const tokenSchema = new Schema({
    usuarioId:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true,
    },
    numIdentificacionUsuario:{
        type: String,
        required: true
    },
    token:{
        type: String,
        required: true
    },
    fechaCreacion:{
        type: Date,
        required: true
    },
    fechaCaducidad:{
        type: Date,
        required: true
    }
});

const tokens = model("Token", tokenSchema, "tokens");

export {tokens}