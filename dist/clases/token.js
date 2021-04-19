"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
class Token {
    constructor() { }
    static generaToken(payload) {
        //firmar token con clave secreta
        const miToken = jsonwebtoken_1.default.sign({ usuario: payload }, Token.secreto, { expiresIn: Token.caducidad });
        return miToken;
    }
    static verificaToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, Token.secreto, (err, decoded) => {
                if (err) {
                    console.log('token invalido');
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
Token.data = dotenv_1.default.config();
Token.secreto = Token.data.parsed.SECRETO;
Token.caducidad = '365d'; //'365d'
