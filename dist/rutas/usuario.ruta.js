"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controlador_1 = __importDefault(require("../controladores/usuario.controlador"));
const autenticacion_1 = require("../middlewares/autenticacion");
const usuarioRutas = express_1.Router();
//usuarioController es el nombre de la clase, no del objeto
usuarioRutas.get('/getSaludo', usuario_controlador_1.default.prototype.getSaludo);
usuarioRutas.get('/mostrarUsuario', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.mostrarUsuario);
usuarioRutas.post('/mostrarLibreria', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.mostrarLibreria);
usuarioRutas.post('/postDePrueba', usuario_controlador_1.default.prototype.postDePrueba);
usuarioRutas.post('/registro', usuario_controlador_1.default.prototype.registro);
usuarioRutas.post('/registroLibreria', usuario_controlador_1.default.prototype.registroLibreria);
usuarioRutas.post('/guardar-datos-editados-libreria', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.guardarDatosEditadosLibreria);
usuarioRutas.post('/guardar-datos-editados-bibliofilo', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.guardarDatosEditadosBibliofilo);
usuarioRutas.post('/login', usuario_controlador_1.default.prototype.login);
usuarioRutas.post('/guadarLibreriaFav', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.guadarLibreriaFav);
usuarioRutas.get('/getUsuario', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.getUsuario);
usuarioRutas.post('/mostrarLibrosFavoritos', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.mostrarLibrosFavoritos);
usuarioRutas.post('/borrarLibreriaFav', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.borrarLibreriaFav);
exports.default = usuarioRutas;
