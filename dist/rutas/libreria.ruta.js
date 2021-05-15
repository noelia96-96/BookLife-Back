"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const libreria_controlador_1 = __importDefault(require("../controladores/libreria.controlador"));
const autenticacion_1 = require("../middlewares/autenticacion");
const libreriaRutas = express_1.Router();
libreriaRutas.get('/mostrarLibreria', autenticacion_1.autenticacion, libreria_controlador_1.default.prototype.mostrarLibreria);
exports.default = libreriaRutas;
