import {Router} from "express";
import usuarioController from '../controladores/usuario.controlador';
import { autenticacion } from '../middlewares/autenticacion';

const usuarioRutas = Router();

//usuarioController es el nombre de la clase, no del objeto
usuarioRutas.get('/getSaludo', usuarioController.prototype.getSaludo);
usuarioRutas.get('/mostrarUsuario',autenticacion, usuarioController.prototype.mostrarUsuario);
usuarioRutas.post('/postDePrueba', usuarioController.prototype.postDePrueba);
usuarioRutas.post('/registro', usuarioController.prototype.registro);
usuarioRutas.post('/registro-libreria', usuarioController.prototype.registroLibreria);
usuarioRutas.post('/guardar-datos-editados-libreria', usuarioController.prototype.guardarDatosEditadosLibreria);
usuarioRutas.post('/guardar-datos-editados-bibliofilo', usuarioController.prototype.guardarDatosEditadosBibliofilo);
usuarioRutas.post('/login', usuarioController.prototype.login);
usuarioRutas.get('/getUsuario',autenticacion, usuarioController.prototype.getUsuario);




export default usuarioRutas;
