"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
const libro_modelo_1 = require("../modelos/libro.modelo");
const usuario_modelo_1 = require("../modelos/usuario.modelo");
class libroController {
    registrarLibro(req, res) {
        console.log(req);
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
                // Libros
                let params = req.body;
                const libroNuevo = new libro_modelo_1.Libro();
                libroNuevo.nombreLibro = params.nombreLibro;
                //el creador se recupera de la BBDD directamente a la hora de hacer el registro
                libroNuevo.creador = usuario;
                libroNuevo.genero = params.genero;
                libroNuevo.autor = params.autor;
                libroNuevo.precio = params.precio;
                libroNuevo.participantes = params.participantes;
                console.log(params);
                libro_modelo_1.Libro.create(libroNuevo).then((libroDB) => {
                    if (!libroDB) {
                        res.status(500).send({
                            status: 'error',
                            mensaje: 'Error al publicar el libro'
                        });
                    }
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Se ha publicado el libro' + libroDB.nombreLibro,
                        libro: libroDB
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
    //Cargar libros propios
    getLibros(req, res) {
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
                libro_modelo_1.Libro.find({ creador: usuario }).sort('nombreLibro').limit(params.limite).then((librosDB) => {
                    if (!librosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Libros incorrectos'
                        });
                    }
                    const librosQueDevuelvo = new Array();
                    librosQueDevuelvo.push(librosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        libro: librosQueDevuelvo,
                        token: token_1.default.generaToken(librosQueDevuelvo)
                    });
                });
            }
        });
    }
    //Mostrar libros al bibliofilo
    mostrarLibros(req, res) {
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
                usuario_modelo_1.Usuario.find({ ciudad: ciudad }).then((usuariosDB) => {
                    if (!usuariosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Usuarios incorrectos'
                        });
                    }
                    const nombreLibreros = new Array();
                    usuariosDB.forEach(function (value) {
                        nombreLibreros.push(value.nombre);
                    });
                    libro_modelo_1.Libro.find({ creador: { $in: nombreLibreros } }).then((librosDB) => {
                        if (!usuariosDB) {
                            return res.status(200).send({
                                status: 'error',
                                mensaje: 'Libros incorrectos'
                            });
                        }
                        const librosQueDevuelvo = new Array();
                        librosQueDevuelvo.push(librosDB);
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Muestra de datos correcta',
                            libro: librosQueDevuelvo,
                            token: token_1.default.generaToken(librosQueDevuelvo)
                        });
                    });
                });
            }
        });
    }
    borrar(req, res) {
        let params = req.body;
        libro_modelo_1.Libro.findByIdAndRemove(params._id).then((libroDB) => {
            if (!libroDB) {
                res.status(500).send({
                    status: 'error',
                    mensaje: 'Error al borrar el libro'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'Se ha borrado el libro',
                libro: libroDB
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
                libro_modelo_1.Libro.findOne({ _id: params._id }).then(libroDB => {
                    if (!libroDB) {
                        return res.status(400).send({
                            status: 'error',
                            mensaje: 'El libro no existe',
                        });
                    }
                    if (libroDB.participantes.length === 4) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'El libro ya ha sido reservado',
                        });
                    }
                    else {
                        libroDB.participantes.push(usuario);
                    }
                    libroDB.save().then(() => {
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Libro actualizado'
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
    quitarReserva(req, res) {
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
                libro_modelo_1.Libro.findOne({ _id: params._id }).then(libroDB => {
                    if (!libroDB) {
                        return res.status(400).send({
                            status: 'error',
                            mensaje: 'Error al borrar el libro',
                        });
                    }
                    var indice = libroDB.participantes.indexOf(usuario);
                    libroDB.participantes.splice(indice, 1);
                    libroDB.save().then(() => {
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Libro actualizado'
                        });
                    });
                });
            }
        });
    }
    //Recupera el libro para editarlo
    buscarLibro(req, res) {
        let params = req.body;
        const idQueLlega = params._id;
        libro_modelo_1.Libro.findById(idQueLlega).then((librosDB) => {
            if (!librosDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Búsqueda fallida'
                });
            }
            const librosQueDevuelvo = new Array();
            librosQueDevuelvo.push(librosDB);
            res.status(200).send({
                status: 'ok',
                mensaje: 'Búsqueda de libros exitosa',
                libro: librosQueDevuelvo,
                token: token_1.default.generaToken(librosQueDevuelvo)
            });
        });
    }
    //Guardar libro editado
    guardarDatosEditados(req, res) {
        let params = req.body;
        const idQueLlega = params._id;
        libro_modelo_1.Libro.findById(idQueLlega).then(libroDB => {
            if (!libroDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar el libro',
                });
            }
            if (libroDB.nombreLibro !== params.nombreLibro || libroDB.genero !== params.genero || libroDB.autor !== params.autor || libroDB.precio !== params.precio) {
                libroDB.nombreLibro = params.nombreLibro;
                libroDB.genero = params.genero;
                libroDB.autor = params.autor;
                libroDB.precio = params.precio;
            }
            libroDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Libro editado'
                });
            });
        });
    }
}
exports.default = libroController;
