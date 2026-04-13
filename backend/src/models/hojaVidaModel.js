import mongoose from "mongoose";

const { Schema, model } = mongoose;

const hojaVidaSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true,
        unique: true
    },
    apellidos: {
        type: [String],
        required: true
    },
    fechaNacimiento: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    datosContacto: {
        telefono: {
            type: String,
            required: true
        },
        direccionResidencia: {
            type: String,
            required: true
        },
        tipoResidencia: {
            type: String,
            enum: ["RURAL", "URBANA"],
            default: "URBANA"
        }
    },
    formacionAcademica: [{
        nivelAcademico: {
            type: String,
            required: true,
            enum: ["pregrado", "postgrado"]
        },
        nivelFormacion: {
            type: String,
            required: true,
            enum: ["doctorado", "maestria"]
        },
        areaConocimiento: {
            type: String,
            required: true
        },
        pais: {
            type: String,
            required: true
        },
        institucion: {
            type: String,
            required: true
        },
        programaAcademico: {
            type: String,
            required: true
        },
        tituloObtenido: {
            type: String,
            required: true
        },
        semestresAprobados: {
            type: Number,
            required: true
        },
        estadoEstudio: {
            type: String,
            required: true,
            enum: ["finalizado", "enProceso"]
        },
        fechaTerminacionMaterias: {
            type: Date,
            required: true
        },
        fechaGrado: {
            type: Date,
            required: true
        },
        tarjetaProfesional: {
            type: String
        }
    }],
    experienciaLaboral: [{
        tipoInstitucion: {
            type: String,
            required: true,
            enum: ["publico", "privado"]
        },
        nombreInstitucion: {
            type: String,
            required: true
        },
        ubicacion: {
            ciudad: {
                type: String,
                required: true
            },
            pais: {
                type: String,
                required: true
            },
            departamento: {
                type: String,
                required: true
            },
            tipoZona: {
                type: String,
                required: true,
                enum: ["RURAL", "URBANA"]
            },
            direccion: {
                type: String,
                required: true
            }
        },
        cargo: {
            type: String,
            required: true
        },
        fechaIngreso: {
            type: Date,
            required: true
        },
        fechaTerminacion: {
            type: Date,
            required: true
        },
        jornadaLaboral: {
            type: String,
            required: true,
            enum: ["completa", "parcial"]
        },
        motivoRetiro: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

const HojaVida = model("HojaVida", hojaVidaSchema);

export default HojaVida;