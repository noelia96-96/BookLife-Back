import {Router} from "express";
import libroController from '../controladores/libro.controlador';
import { autenticacion } from '../middlewares/autenticacion';

const libroRutas = Router();

libroRutas.post('/registrarLibro',autenticacion, libroController.prototype.registrarLibro);
libroRutas.post('/mostrarLibro',autenticacion, libroController.prototype.getLibros);
libroRutas.post('/mostrarLibrosBibliofilo',autenticacion, libroController.prototype.mostrarLibros);
libroRutas.post('/borrarLibro',autenticacion, libroController.prototype.borrar);
libroRutas.post('/buscarLibro',autenticacion, libroController.prototype.buscarLibro);
libroRutas.post('/guardar',autenticacion, libroController.prototype.guardarDatosEditados);
libroRutas.post('/reservarLibro',autenticacion, libroController.prototype.reservarLibro);
libroRutas.post('/quitarReservaLibro',autenticacion, libroController.prototype.quitarReservaLibro);
libroRutas.post('/mostrarLibrosPicharCard',autenticacion, libroController.prototype.mostrarLibrosPicharCard);

export default libroRutas;