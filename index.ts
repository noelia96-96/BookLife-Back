import {Server} from './clases/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import usuarioRutas from './rutas/usuario.ruta';
import mongoose, { Schema } from 'mongoose';
import eventoRutas from './rutas/evento.ruta';
import libroRutas from './rutas/libro.ruta';

const server = new Server();

//MIDDLEWARES

//1. bodyParser                                    
server.app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
server.app.use(bodyParser.json({ limit: '5mb' }));

//2. configuracion del CORS
server.app.use(cors({
    origin: true,
    credentials: true
}));

//usuarioRutas es array de rutas
//cuando entre algo con /usuario se vaya a usuarioRutas
server.app.use('/usuario', usuarioRutas);
//Evento
server.app.use('/evento', eventoRutas);
//Libro
server.app.use('/libro', libroRutas);

require('dotenv').config();

//Variables de entornos
let dbhost = process.env["DB_HOST"];
let dbuser = process.env["DB_USER"];
let dbpassword = process.env["DB_PASSWORD"];

//conectamos la bbdd
mongoose.connect(
    "mongodb+srv://" +
      dbuser +
      ":" +
      dbpassword +
      "@" +
      dbhost +
      "/myFirstDatabase?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log("error", err);
        throw err;
      } else {
        console.log("Conectado a la base de datos");
      }
    }
  );

server.start(()=>{
    console.log('Servidor iniciado en el puerto' + server.port);
});