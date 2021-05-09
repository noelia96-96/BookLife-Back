"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libro = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
//esquema - estructura de la tabla
const libroSchema = new mongoose_1.Schema({
    creador: { type: String },
    nombreLibro: { type: String, unique: true },
    genero: { type: String },
    autor: { type: String },
    precio: { type: String },
    participantes: [{ type: String }]
}, {
    timestamps: true
});
//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
exports.Libro = mongoose_2.default.model('Libro', libroSchema);
