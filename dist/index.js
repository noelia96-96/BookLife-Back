"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./clases/server");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const usuario_ruta_1 = __importDefault(require("./rutas/usuario.ruta"));
const mongoose_1 = __importDefault(require("mongoose"));
const evento_ruta_1 = __importDefault(require("./rutas/evento.ruta"));
const libro_ruta_1 = __importDefault(require("./rutas/libro.ruta"));
const server = new server_1.Server();
//MIDDLEWARES
//1. bodyParser                                    
server.app.use(body_parser_1.default.urlencoded({ limit: '5mb', extended: true }));
server.app.use(body_parser_1.default.json({ limit: '5mb' }));
//2. configuracion del CORS
server.app.use(cors_1.default({
    origin: true,
    credentials: true
}));
//usuarioRutas es array de rutas
//cuando entre algo con /usuario se vaya a usuarioRutas
server.app.use('/usuario', usuario_ruta_1.default);
//Evento
server.app.use('/evento', evento_ruta_1.default);
//Libro
server.app.use('/libro', libro_ruta_1.default);
//Variables de entornos
let dbhost = process.env["DB_HOST"];
let dbuser = process.env["DB_USER"];
let dbpassword = process.env["DB_PASSWORD"];
//conectamos la bbdd
mongoose_1.default.connect("mongodb+srv://" +
    dbuser +
    ":" +
    dbpassword +
    "@" +
    dbhost +
    "/myFirstDatabase?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.log("error", err);
        throw err;
    }
    else {
        console.log("Conectado a la base de datos");
    }
});
server.start(() => {
    console.log('Servidor iniciado en el puerto' + server.port);
});
