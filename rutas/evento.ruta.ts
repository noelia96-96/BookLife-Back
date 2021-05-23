import {Router} from "express";
import eventoController from '../controladores/evento.controlador';
import { autenticacion } from '../middlewares/autenticacion';

const eventoRutas = Router();

eventoRutas.post('/registrar',autenticacion, eventoController.prototype.registrar);
eventoRutas.post('/mostrarEvento',autenticacion, eventoController.prototype.getEvento);
eventoRutas.post('/mostrarEventoABibliofilo',autenticacion, eventoController.prototype.getEventosPorBibliofilo);
eventoRutas.post('/borrarEvento',autenticacion, eventoController.prototype.borrarEvento);
eventoRutas.post('/apuntarse',autenticacion, eventoController.prototype.apuntarse);
eventoRutas.post('/desapuntarse',autenticacion, eventoController.prototype.desapuntarse);
eventoRutas.post('/buscarEvento',autenticacion, eventoController.prototype.buscarEvento);
eventoRutas.post('/guardar',autenticacion, eventoController.prototype.guardar);
eventoRutas.post('/mostrarEventosPicharCard',autenticacion, eventoController.prototype.mostrarEventosPicharCard);


export default eventoRutas;