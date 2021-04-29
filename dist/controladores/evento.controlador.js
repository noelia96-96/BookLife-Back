"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
const evento_modelo_1 = require("../modelos/evento.modelo");
const usuario_modelo_1 = require("../modelos/usuario.modelo");
class eventoController {
    registrar(req, res) {
        let _id = req.body.usuario._id;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                let usuario = usuarioDB.nombre;
                // Evento
                let params = req.body;
                const eventoNuevo = new evento_modelo_1.Evento();
                eventoNuevo.nombreEvento = params.nombreEvento;
                //el creador se recupera de la BBDD directamente a la hora de hacer el registro
                eventoNuevo.creador = usuario;
                eventoNuevo.lugar = params.lugar;
                eventoNuevo.fecha = params.fecha;
                eventoNuevo.hora = params.hora;
                console.log(params);
                //eventoNuevo.minutos = params.minutos;
                eventoNuevo.participantes = params.participantes;
                evento_modelo_1.Evento.create(eventoNuevo).then((eventoDB) => {
                    if (!eventoDB) {
                        res.status(500).send({
                            status: 'error',
                            mensaje: 'error al crear el evento'
                        });
                    }
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'se ha creado el evento' + eventoDB.nombreEvento,
                        evento: eventoDB
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).send({
                        status: 'error',
                        error: err
                    });
                });
            }
        });
    }
    //Cargar eventos propios
    getEvento(req, res) {
        let _id = req.body.usuario._id;
        let params = req.body;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                let usuario = usuarioDB.nombre;
                evento_modelo_1.Evento.find({ creador: usuario }).sort('fecha').limit(params.limite).then((eventosDB) => {
                    if (!eventosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'eventos incorrectos'
                        });
                    }
                    const eventosQueDevuelvo = new Array();
                    eventosQueDevuelvo.push(eventosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        evento: eventosQueDevuelvo,
                        token: token_1.default.generaToken(eventosQueDevuelvo)
                    });
                });
            }
        });
    }
    //cargar eventos ajenos
    getEventoAjenos(req, res) {
        let _id = req.body.usuario._id;
        let params = req.body;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                let usuario = usuarioDB.nombre;
                // //$ne buscar por los eventos que no ha creado
                evento_modelo_1.Evento.find({ creador: { $ne: usuario } }).sort('fecha').limit(params.limite).then((eventosDB) => {
                    if (!eventosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'eventos incorrectos'
                        });
                    }
                    const eventosQueDevuelvo = new Array();
                    eventosQueDevuelvo.push(eventosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        evento: eventosQueDevuelvo,
                        token: token_1.default.generaToken(eventosQueDevuelvo)
                    });
                });
            }
        });
    }
    borrarEvento(req, res) {
        let params = req.body;
        evento_modelo_1.Evento.findByIdAndRemove(params._id).then((eventoDB) => {
            if (!eventoDB) {
                res.status(500).send({
                    status: 'error',
                    mensaje: 'error al borrar el evento'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'se ha borrado el evento',
                evento: eventoDB
            });
        }).catch(err => {
            res.status(500).send({
                status: 'error',
                error: err
            });
        });
    }
    apuntarse(req, res) {
        let _id = req.body.usuario._id;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                let usuario = usuarioDB.nombre;
                //CODIGO AQUI
                let params = req.body;
                const idQueLlega = params._id;
                evento_modelo_1.Evento.findOne({ _id: params._id }).then(eventDB => {
                    if (!eventDB) {
                        return res.status(400).send({
                            status: 'error',
                            mensaje: 'El evento no existe',
                        });
                    }
                    if (eventDB.participantes.length === 4) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'El evento está completo',
                        });
                    }
                    else {
                        eventDB.participantes.push(usuario);
                    }
                    eventDB.save().then(() => {
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Evento actualizado'
                        });
                    }).catch(err => {
                        res.status(500).send({
                            status: 'error',
                            mensaje: err
                        });
                    });
                });
            }
        });
    }
    desapuntarse(req, res) {
        let _id = req.body.usuario._id;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                let usuario = usuarioDB.nombre;
                //CODIGO AQUI
                let params = req.body;
                const idQueLlega = params._id;
                evento_modelo_1.Evento.findOne({ _id: params._id }).then(eventDB => {
                    if (!eventDB) {
                        return res.status(400).send({
                            status: 'error',
                            mensaje: 'Error al borrarse del evento',
                        });
                    }
                    var indice = eventDB.participantes.indexOf(usuario);
                    eventDB.participantes.splice(indice, 1);
                    eventDB.save().then(() => {
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Evento actualizado'
                        });
                    });
                });
            }
        });
    }
    //Recupera el evento para editarlo
    buscarEvento(req, res) {
        let params = req.body;
        const idQueLlega = params._id;
        evento_modelo_1.Evento.findById(idQueLlega).then((eventosDB) => {
            if (!eventosDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Búsqueda fallida'
                });
            }
            const eventosQueDevuelvo = new Array();
            eventosQueDevuelvo.push(eventosDB);
            res.status(200).send({
                status: 'ok',
                mensaje: 'Búsqueda de eventos exitosa',
                evento: eventosQueDevuelvo,
                token: token_1.default.generaToken(eventosQueDevuelvo)
            });
        });
    }
    //Guardar evento editado
    guardar(req, res) {
        let params = req.body;
        const idQueLlega = params._id;
        evento_modelo_1.Evento.findById(idQueLlega).then(eventDB => {
            if (!eventDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar del evento',
                });
            }
            if (eventDB.nombreEvento !== params.nombreEvento || eventDB.fecha !== params.fecha) {
                eventDB.nombreEvento = params.nombreEvento;
                eventDB.fecha = params.fecha;
            }
            eventDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Evento editado'
                });
            });
        });
    }
}
exports.default = eventoController;
