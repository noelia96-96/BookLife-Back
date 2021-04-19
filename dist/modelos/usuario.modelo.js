"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
//esquema - estructura de la tabla
const usuarioSchema = new mongoose_1.Schema({
    nombre: { type: String, unique: true },
    email: { type: String, unique: true },
    pwd: { type: String },
    edad: { type: Number }
}, {
    timestamps: true
});
//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
exports.Usuario = mongoose_2.default.model('Usuario', usuarioSchema);
