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
                eventoNuevo.direccion = params.direccion;
                eventoNuevo.ciudad = params.ciudad;
                eventoNuevo.fecha = params.fecha;
                eventoNuevo.hora = params.hora;
                eventoNuevo.participantes = params.participantes;
                evento_modelo_1.Evento.create(eventoNuevo).then((eventoDB) => {
                    if (!eventoDB) {
                        res.status(500).send({
                            status: 'error',
                            mensaje: 'Error al crear el evento'
                        });
                    }
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Se ha creado el evento' + eventoDB.nombreEvento,
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
        console.log(req);
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
                let ciudad = usuarioDB.ciudad;
                evento_modelo_1.Evento.find({ ciudad: ciudad }).sort('fecha').limit(params.limite).then((eventosParaBibliofiloDB) => {
                    if (!eventosParaBibliofiloDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Eventos incorrectos'
                        });
                    }
                    const eventosParaBibliofiloQueDevuelvo = new Array();
                    eventosParaBibliofiloQueDevuelvo.push(eventosParaBibliofiloDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        evento: eventosParaBibliofiloQueDevuelvo,
                        token: token_1.default.generaToken(usuarioDB)
                    });
                });
            }
        });
    }
    //Cargar eventos por bibliofilo
    getEventosPorBibliofilo(req, res) {
        console.log(req);
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
                let ciudad = usuarioDB.ciudad;
                evento_modelo_1.Evento.find({ ciudad: ciudad }).sort('fecha').limit(params.limite).then((eventosDB) => {
                    if (!eventosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Eventos incorrectos'
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
                    mensaje: 'Error al borrar el evento'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'Se ha borrado el evento',
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
                let params = req.body;
                const idQueLlega = params._id;
                evento_modelo_1.Evento.findOne({ _id: params._id }).then(eventDB => {
                    if (!eventDB) {
                        return res.status(400).send({
                            status: 'error',
                            mensaje: 'Error al borrar el evento',
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
                    mensaje: 'Error al editar el evento',
                });
            }
            if (eventDB.nombreEvento !== params.nombreEvento || eventDB.direccion !== params.direccion || eventDB.ciudad !== params.ciudad || eventDB.fecha !== params.fecha || eventDB.hora !== params.hora) {
                eventDB.nombreEvento = params.nombreEvento;
                eventDB.direccion = params.direccion;
                eventDB.ciudad = params.ciudad;
                eventDB.fecha = params.fecha;
                eventDB.hora = params.hora;
            }
            eventDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Evento editado'
                });
            });
        });
    }
    mostrarEventosPicharCard(req, res) {
        console.log(req);
        let _id = req.body.usuario._id;
        let params = req.body;
        let libreriaPinchada = params.libreriaPinchadaCard;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                evento_modelo_1.Evento.find({ creador: libreriaPinchada }).then((eventosDB) => {
                    if (!eventosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Muestra incorrecta de los eventos'
                        });
                    }
                    const eventosQueDevuelvo = new Array();
                    eventosQueDevuelvo.push(eventosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        evento: eventosQueDevuelvo,
                        token: token_1.default.generaToken(usuarioDB)
                    });
                });
            }
        });
    }
}
exports.default = eventoController;
