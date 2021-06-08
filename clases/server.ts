import express from 'express';

//Crear clase server con dos atributos, que sera llamada desde el index.ts
export class Server{

    public app:express.Application;
    public port:any =  process.env.PORT || 3300;
    constructor(){
        this.app = express();
        this.app.use('/public',express.static(`./img/`));
    }

//Metodo para iniciarlo
//Escucha las peticiones que se ralizan al puerto
//datos es la función que queremos llamar cuando se levanta el servidor

start(datos:()=>void){
    this.app.listen(this.port, datos);
}


}