"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
const libreria_modelo_1 = require("../modelos/libreria.modelo");
class libreriaController {
    //Cargar librerias
    mostrarLibreria(req, res) {
        console.log(req);
        let _id = req.body.usuario._id;
        let params = req.body;
        Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                let usuario = usuarioDB.nombre;
                libreria_modelo_1.Libreria.find({ creador: usuario }).sort('fecha').limit(params.limite).then((libreriasDB) => {
                    if (!libreriasDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Librerias incorrectas'
                        });
                    }
                    const libreriasQueDevuelvo = new Array();
                    libreriasQueDevuelvo.push(libreriasDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        libreria: libreriasQueDevuelvo,
                        token: token_1.default.generaToken(libreriasQueDevuelvo)
                    });
                });
            }
        });
    }
}
exports.default = libreriaController;
