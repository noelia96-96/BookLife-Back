"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticacion = void 0;
const token_1 = __importDefault(require("../clases/token"));
exports.autenticacion = (req, res, next) => {
    let userToken = req.get('Authorization') || '';
    userToken = userToken.split('Bearer ')[1];
    token_1.default.verificaToken(userToken).then((decoded) => {
        req.body.usuario = decoded.usuario;
        next();
    }).catch(err => {
        console.log('hay error aqui', err);
        if (err.message == 'invalid token') {
            res.status(200).json({
                status: 'error',
                mensaje: 'Token inválido'
            });
        }
        else {
            res.status(200).json({
                status: 'error',
                mensaje: 'Sesión caducada'
            });
        }
    });
};
