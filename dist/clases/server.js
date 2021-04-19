"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
//Crear clase server con dos atributos, que sera llamada desde el index.ts
class Server {
    constructor() {
        this.port = 3300;
        this.app = express_1.default();
    }
    //Metodo para iniciarlo
    //Escucha las peticiones que se ralizan al puerto
    //datos es la función que queremos llamar cuando se levanta el servidor
    start(datos) {
        this.app.listen(this.port, datos);
    }
}
exports.Server = Server;
