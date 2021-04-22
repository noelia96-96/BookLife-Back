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
    registro(req, res) {
        // Usuario
        let params = req.body;
        const usuarioNuevo = new usuario_modelo_1.Usuario();
        usuarioNuevo.nombre = params.nombre;
        usuarioNuevo.pwd = params.pwd;
        usuarioNuevo.email = params.email;
        usuarioNuevo.ciudad = params.ciudad;
        usuarioNuevo.sexo = params.sexo;
        usuario_modelo_1.Usuario.create(usuarioNuevo).then((usuarioDB) => {
            if (!usuarioDB) {
                res.status(500).send({
                    status: 'error',
                    mensaje: 'error al crear el usuario'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'se ha creado el usuario' + usuarioDB.nombre,
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
        usuarioNuevo.sexo = params.sexo;
        usuario_modelo_1.Usuario.create(usuarioNuevo).then((usuarioDB) => {
            if (!usuarioDB) {
                res.status(500).send({
                    status: 'error',
                    mensaje: 'error al crear el usuario'
                });
            }
            res.status(200).send({
                status: 'ok',
                mensaje: 'se ha creado el usuario' + usuarioDB.nombre,
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
}
;
exports.default = usuarioController;
