"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const libro_controlador_1 = __importDefault(require("../controladores/libro.controlador"));
const autenticacion_1 = require("../middlewares/autenticacion");
const libroRutas = express_1.Router();
libroRutas.post('/registrarLibro', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.registrarLibro);
libroRutas.post('/mostrarLibro', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.getLibros);
libroRutas.post('/mostrarLibrosBibliofilo', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.mostrarLibros);
libroRutas.post('/borrarLibro', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.borrar);
libroRutas.post('/buscarLibro', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.buscarLibro);
libroRutas.post('/guardar', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.guardarDatosEditados);
libroRutas.post('/reservarLibro', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.reservarLibro);
libroRutas.post('/quitarReservaLibro', autenticacion_1.autenticacion, libro_controlador_1.default.prototype.quitarReservaLibro);
exports.default = libroRutas;
