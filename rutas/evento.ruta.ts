import {Router} from "express";
import eventoController from '../controladores/evento.controlador';
import { autenticacion } from '../middlewares/autenticacion';

const eventoRutas = Router();

eventoRutas.post('/registrar',autenticacion, eventoController.prototype.registro);
eventoRutas.post('/mostrarEvento',autenticacion, eventoController.prototype.getEvento);
eventoRutas.post('/mostrarEventoAjenos',autenticacion, eventoController.prototype.getEventoAjenos);
eventoRutas.post('/borrarEvento',autenticacion, eventoController.prototype.borrarEvento);
eventoRutas.post('/apuntarse',autenticacion, eventoController.prototype.apuntarse);
eventoRutas.post('/desapuntarse',autenticacion, eventoController.prototype.desapuntarse);
eventoRutas.post('/buscarEvento',autenticacion, eventoController.prototype.buscarEvento);
eventoRutas.post('/guardar',autenticacion, eventoController.prototype.guardar);

export default eventoRutas;