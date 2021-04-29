"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evento = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
//esquema - estructura de la tabla
const eventoSchema = new mongoose_1.Schema({
    nombreEvento: { type: String, unique: true },
    creador: { type: String },
    lugar: { type: String },
    fecha: { type: Date },
    hora: { type: Date },
    //minutos:{type:Number},
    participantes: [{ type: String }]
}, {
    timestamps: true
});
//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
exports.Evento = mongoose_2.default.model('Evento', eventoSchema);
