"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
const usuario_modelo_1 = require("../modelos/usuario.modelo");
class usuarioController {
    getSaludo(req, res) {
        const nombre = req.query.nombre || 'desconocid@';
        res.status(200).send({
            status: 'ok',
            mensaje: 'hola, ' + nombre,
            dia: new Date()
        });
    }
    postDePrueba(req, res) {
        let usuario = req.body;
        if (!usuario.usuario) {
            res.status(200).send({
                status: 'error',
                mensaje: 'El usuario es necesario'
            });
        }
        res.status(200).send({
            status: 'ok',
            usuario: usuario
        });
    }
    //Cargar usuarios propios
    mostrarUsuario(req, res) {
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
                let usuario = usuarioDB.nombre;
                usuario_modelo_1.Usuario.find({ nombre: usuario }).then((usuariosDB) => {
                    if (!usuariosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Usuarios incorrectos'
                        });
                    }
                    const usuarioQueDevuelvo = new Array();
                    usuarioQueDevuelvo.push(usuariosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        usuario: usuarioQueDevuelvo,
                        token: token_1.default.generaToken(usuario)
                    });
                });
            }
        });
    }
    //Cargar usuarios tipo librero - libreria
    mostrarLibreria(req, res) {
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
                usuario_modelo_1.Usuario.find({ "$and": [{ direccion: { $exists: true } }, { ciudad: ciudad }] }).then((usuariosLibrerosDB) => {
                    if (!usuariosLibrerosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Usuarios tipo librero incorrectos'
                        });
                    }
                    const usuarioLibreroQueDevuelvo = new Array();
                    usuarioLibreroQueDevuelvo.push(usuariosLibrerosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        usuario: usuarioLibreroQueDevuelvo,
                        token: token_1.default.generaToken(usuarioDB)
                    });
                });
            }
        });
    }
    registro(req, res) {
        // Usuario
        let params = req.body;
        const usuarioNuevo = new usuario_modelo_1.Usuario();
        usuarioNuevo.nombre = params.nombre;
        usuarioNuevo.pwd = params.pwd;
        usuarioNuevo.email = params.email;
        usuarioNuevo.ciudad = params.ciudad;
        usuarioNuevo.sexo = params.sexo;
        usuarioNuevo.favoritos = params.favoritos;
        usuario_modelo_1.Usuario.create(usuarioNuevo).then((usuarioDB) => {
            if (!usuarioDB) {
                res.status(500).send({
                    status: 'error',
                    mensaje: 'Error al crear el usuario'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'Se ha creado el usuario' + usuarioDB.nombre,
                usuario: usuarioDB
            });
        }).catch(err => {
            res.status(500).send({
                status: 'error',
                error: err
            });
        });
    }
    registroLibreria(req, res) {
        // Usuario
        let params = req.body;
        const usuarioNuevo = new usuario_modelo_1.Usuario();
        usuarioNuevo.nombre = params.nombre;
        usuarioNuevo.ciudad = params.ciudad;
        usuarioNuevo.direccion = params.direccion;
        usuarioNuevo.telefono = params.telefono;
        usuarioNuevo.web = params.web;
        usuarioNuevo.email = params.email;
        usuarioNuevo.pwd = params.pwd;
        console.log(usuarioNuevo);
        usuario_modelo_1.Usuario.create(usuarioNuevo).then((usuarioDB) => {
            if (!usuarioDB) {
                res.status(500).send({
                    status: 'error',
                    mensaje: 'Error al crear el usuario'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'Se ha creado el usuario' + usuarioDB.nombre,
                usuario: usuarioDB
            });
        }).catch(err => {
            res.status(500).send({
                status: 'error',
                error: err
            });
        });
    }
    getUsuario(req, res) {
        let _id = req.body.usuario._id;
        usuario_modelo_1.Usuario.findById(_id).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Token inválido'
                });
            }
            else {
                const usuarioQueDevuelvo = new usuario_modelo_1.Usuario();
                usuarioQueDevuelvo.nombre = usuarioDB.nombre;
                usuarioQueDevuelvo._id = usuarioDB._id;
                usuarioQueDevuelvo.ciudad = usuarioDB.ciudad;
                usuarioQueDevuelvo.favoritos = usuarioDB.favoritos;
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Login correcto',
                    usuario: usuarioQueDevuelvo,
                    token: token_1.default.generaToken(usuarioQueDevuelvo)
                });
            }
        });
    }
    login(req, res) {
        // Usuario
        let params = req.body;
        const nombreQueLlega = params.nombre;
        const pwdQueLlega = params.pwd;
        //buscar los usuarios que cumplan estas dos condiciones
        //con una promesa, si lo encuentra devuelve un usuario con unos datos concretos (no todos)
        usuario_modelo_1.Usuario.findOne({ nombre: nombreQueLlega, pwd: pwdQueLlega }).then((usuarioDB) => {
            if (!usuarioDB) {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Usuario y/o contraseña incorrectas'
                });
            }
            const usuarioQueDevuelvo = new usuario_modelo_1.Usuario();
            usuarioQueDevuelvo.nombre = usuarioDB.nombre;
            usuarioQueDevuelvo._id = usuarioDB._id;
            usuarioQueDevuelvo.web = usuarioDB.web;
            usuarioQueDevuelvo.sexo = usuarioDB.sexo;
            res.status(200).send({
                status: 'ok',
                menesaj: 'Login correcto',
                usuario: usuarioQueDevuelvo,
                token: token_1.default.generaToken(usuarioQueDevuelvo)
            });
        }).catch(err => {
            return res.status(500).send({
                status: 'error',
                mensaje: 'Error en la BBDD',
                error: err
            });
        });
    }
    //Guardar datos personales editados del librero
    guardarDatosEditadosLibreria(req, res) {
        let params = req.body;
        const idQueLlega = params._id;
        usuario_modelo_1.Usuario.findById(idQueLlega).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar los datos personales',
                });
            }
            if (usuarioDB.nombre !== params.nombre || usuarioDB.pwd !== params.pwd || usuarioDB.email !== params.email || usuarioDB.web !== params.web || usuarioDB.telefono !== params.telefono || usuarioDB.ciudad !== params.ciudad || usuarioDB.direccion !== params.direccion) {
                usuarioDB.nombre = params.nombre;
                usuarioDB.pwd = params.pwd;
                usuarioDB.email = params.email;
                usuarioDB.web = params.web;
                usuarioDB.telefono = params.telefono;
                usuarioDB.ciudad = params.ciudad;
                usuarioDB.direccion = params.direccion;
            }
            usuarioDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Datos personales editados'
                });
            });
        });
    }
    ;
    //Guardar datos personales editados del bibliofilo
    guardarDatosEditadosBibliofilo(req, res) {
        let params = req.body;
        const idQueLlega = params._id;
        usuario_modelo_1.Usuario.findById(idQueLlega).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar los datos personales',
                });
            }
            if (usuarioDB.nombre !== params.nombre || usuarioDB.pwd !== params.pwd || usuarioDB.ciudad !== params.ciudad || usuarioDB.sexo !== params.sexo) {
                usuarioDB.nombre = params.nombre;
                usuarioDB.pwd = params.pwd;
                usuarioDB.email = params.email;
                usuarioDB.ciudad = params.ciudad;
                usuarioDB.sexo = params.sexo;
            }
            usuarioDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Datos personales editados'
                });
            });
        });
    }
    ;
    //Guardar la libreria en favoritos
    guadarLibreriaFav(req, res) {
        let params = req.body;
        const idQueLlega = params.usuario._id;
        const libreriaQueLlega = params.libreria;
        console.log(params);
        usuario_modelo_1.Usuario.findById(idQueLlega).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al traer el usuario',
                });
            }
            usuarioDB.favoritos.push(libreriaQueLlega);
            usuarioDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Datos ok'
                });
            });
        });
    }
    //Borrar la libreria de favoritos
    borrarLibreriaFav(req, res) {
        let params = req.body;
        const idQueLlega = params.usuario._id;
        const libreriaQueLlega = params.libreria;
        console.log(params);
        usuario_modelo_1.Usuario.findById(idQueLlega).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al borrar el usuario',
                });
            }
            // obtenemos el indice
            var indice = usuarioDB.favoritos.indexOf(libreriaQueLlega);
            // 1 es la cantidad de elemento a eliminar
            usuarioDB.favoritos.splice(indice, 1);
            usuarioDB.save().then(() => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Datos ok'
                });
            });
        });
    }
    //Mostrar las librerias favoritas en la seccion - Favoritos
    mostrarLibrosFavoritos(req, res) {
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
                let favoritos = usuarioDB.favoritos;
                usuario_modelo_1.Usuario.find({ nombre: { $in: favoritos } }).then((usuariosLibrerosDB) => {
                    if (!usuariosLibrerosDB) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Usuarios tipo librero incorrectos'
                        });
                    }
                    const usuarioLibreroQueDevuelvo = new Array();
                    usuarioLibreroQueDevuelvo.push(usuariosLibrerosDB);
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Muestra de datos correcta',
                        usuario: usuarioLibreroQueDevuelvo,
                        token: token_1.default.generaToken(usuarioDB)
                    });
                });
            }
        });
    }
}
exports.default = usuarioController;
