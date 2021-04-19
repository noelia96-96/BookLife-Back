import {Router} from "express";
import usuarioController from '../controladores/usuario.controlador';
import { autenticacion } from '../middlewares/autenticacion';

const usuarioRutas = Router();

//usuarioController es el nombre de la clase, no del objeto
usuarioRutas.get('/getSaludo', usuarioController.prototype.getSaludo);
usuarioRutas.post('/postDePrueba', usuarioController.prototype.postDePrueba);
usuarioRutas.post('/registro', usuarioController.prototype.registro);
usuarioRutas.post('/login', usuarioController.prototype.login);
usuarioRutas.get('/getUsuario',autenticacion, usuarioController.prototype.getUsuario);


export default usuarioRutas;
