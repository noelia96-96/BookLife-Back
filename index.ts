import {Server} from './clases/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import usuarioRutas from './rutas/usuario.ruta';
import mongoose, { Schema } from 'mongoose';
import eventoRutas from './rutas/evento.ruta';

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

//conectamos la bbdd
//mongoose.connect(ruta, opciones, callback para ver si hay error)
mongoose.connect('mongodb://localhost:27017/hlc2021',
                    {
                        useCreateIndex:true,
                        useUnifiedTopology: true, 
                        useNewUrlParser:true
                    },(err)=>{
                        if(err){
                            console.log("error", err);
                            throw err;
                        }
                        else{
                            console.log('Conectado a la base de datos');
                            //crear esquema. Campos entre llaves
                            //const miEsquema = new Schema({nombre:String});
                            //crear modelo con el que se accede a la bbdd 
                            //const miModelo = mongoose.model('nombreModelo', miEsquema);
                            //miModelo.create({nombre:'pepe'});
                        }
});

server.start(()=>{
    console.log('Servidor iniciado en el puerto' + server.port);
});