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
usuarioRutas.post('/postDePrueba', usuario_controlador_1.default.prototype.postDePrueba);
usuarioRutas.post('/registro', usuario_controlador_1.default.prototype.registro);
usuarioRutas.post('/login', usuario_controlador_1.default.prototype.login);
usuarioRutas.get('/getUsuario', autenticacion_1.autenticacion, usuario_controlador_1.default.prototype.getUsuario);
exports.default = usuarioRutas;
