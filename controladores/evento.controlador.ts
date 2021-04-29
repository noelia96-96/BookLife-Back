import {Request, Response} from "express";
import Token from "../clases/token";
import { Evento } from '../modelos/evento.modelo';
import { Usuario } from '../modelos/usuario.modelo';

class eventoController{
    registrar(req:Request, res:Response){
        let _id = req.body.usuario._id;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
            let usuario = usuarioDB.nombre;
            // Evento
            let params = req.body;
            const eventoNuevo= new Evento();
            eventoNuevo.nombreEvento = params.nombreEvento;
            //el creador se recupera de la BBDD directamente a la hora de hacer el registro
            eventoNuevo.creador = usuario;
            eventoNuevo.lugar = params.lugar;
            eventoNuevo.fecha = params.fecha;
            eventoNuevo.hora = params.hora;
            console.log(params)
            //eventoNuevo.minutos = params.minutos;
            eventoNuevo.participantes = params.participantes;

            Evento.create(eventoNuevo).then((eventoDB)=>{
                if(!eventoDB){
                    res.status(500).send({
                        status:'error',
                        mensaje:'error al crear el evento'
                    })
                }
                res.status(200).send({
                    status:'ok',
                    mensaje:'se ha creado el evento' + eventoDB.nombreEvento,
                    evento: eventoDB
                })
            }).catch(err=>{
                console.log(err);
                res.status(500).send({
                    status: 'error',
                    error: err
                })
            });
        }
    })

    }
     //Cargar eventos propios
     getEvento(req: Request, res:Response){
        let _id = req.body.usuario._id;
        let params = req.body;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
                let usuario = usuarioDB.nombre;
                Evento.find({ creador: usuario }).sort('fecha').limit(params.limite).then((eventosDB)=>{
                    if(!eventosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'eventos incorrectos'
                        })
                    }
                    const eventosQueDevuelvo = new Array<any>();
                    eventosQueDevuelvo.push(eventosDB);
                    res.status(200).send({
                    status:'ok',
                    mensaje: 'Muestra de datos correcta',
                    evento: eventosQueDevuelvo,
                    token: Token.generaToken(eventosQueDevuelvo)
                });
            });
        }
    })
}
    //cargar eventos ajenos
    getEventoAjenos(req: Request, res:Response){
        let _id = req.body.usuario._id;
        let params = req.body;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
                let usuario = usuarioDB.nombre;
                // //$ne buscar por los eventos que no ha creado
                Evento.find({ creador: { $ne: usuario } }).sort('fecha').limit(params.limite).then((eventosDB)=>{
                    if(!eventosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'eventos incorrectos'
                        })
                    }
                    const eventosQueDevuelvo = new Array<any>();
                    eventosQueDevuelvo.push(eventosDB);
                    res.status(200).send({
                    status:'ok',
                    mensaje: 'Muestra de datos correcta',
                    evento: eventosQueDevuelvo,
                    token: Token.generaToken(eventosQueDevuelvo)
                    });
            });
            }
    
    })
    }

     borrarEvento(req: Request, res:Response){
        let params = req.body;
        Evento.findByIdAndRemove(params._id).then((eventoDB)=>{
            if(!eventoDB){
                res.status(500).send({
                  status:'error',
                     mensaje:'error al borrar el evento'
                 })
             }
             res.status(200).send({
                 status:'ok',
                 mensaje:'se ha borrado el evento',
                 evento: eventoDB
             })
         }).catch(err=>{
             res.status(500).send({
                 status: 'error',
                 error: err
             })
         });
     }

     apuntarse(req: Request, res:Response){
        let _id = req.body.usuario._id;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
            let usuario = usuarioDB.nombre;
            //CODIGO AQUI
            let params = req.body;
            const idQueLlega = params._id;
            Evento.findOne({_id: params._id}).then(eventDB => {
                if (!eventDB) {
                    return res.status(400).send({
                        status: 'error',
                        mensaje: 'El evento no existe',
                    }); 
                }
                if(eventDB.participantes.length === 4) {
                    return res.status(200).send({
                        status: 'error',
                        mensaje: 'El evento está completo',
                    }); 
                }else{
                    eventDB.participantes.push(usuario);
                }
                eventDB.save().then( () => {
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Evento actualizado'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: 'error',
                        mensaje: err
                    });
                });
         });

            }
    
    })

    }

    desapuntarse(req: Request, res:Response){

        let _id = req.body.usuario._id;
        Usuario.findById(_id).then((usuarioDB)=>{ 
        if(!usuarioDB){
            return res.status(200).send({
                status:'error',
                mensaje: 'Token inválido'
            })
        }else{            
            let usuario = usuarioDB.nombre;
	    //CODIGO AQUI
        let params = req.body;
        const idQueLlega = params._id;
        Evento.findOne({_id: params._id}).then(eventDB => {
            if (!eventDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al borrarse del evento',
                }); 
            }

            var indice = eventDB.participantes.indexOf(usuario);
            eventDB.participantes.splice(indice,1);

            eventDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Evento actualizado'
                });
            })
     });

        }

})


    }

    //Recupera el evento para editarlo
    buscarEvento(req: Request, res:Response){
        let params = req.body;
        const idQueLlega = params._id;
        Evento.findById(idQueLlega).then((eventosDB)=>{
             if(!eventosDB){
                 return res.status(200).send({
                    status:'error',
                    mensaje: 'Búsqueda fallida'
                 })
             }
             const eventosQueDevuelvo = new Array<any>();
             eventosQueDevuelvo.push(eventosDB);
             res.status(200).send({
                status:'ok',
                mensaje: 'Búsqueda de eventos exitosa',
                evento: eventosQueDevuelvo,
                token: Token.generaToken(eventosQueDevuelvo)
             });

     });

    }

    //Guardar evento editado
    guardar(req: Request, res:Response){
        let params = req.body;
        const idQueLlega = params._id;

        Evento.findById(idQueLlega).then(eventDB => {
            if (!eventDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar del evento',
                }); 
            }
            if(eventDB.nombreEvento !== params.nombreEvento || eventDB.fecha !== params.fecha) {
                eventDB.nombreEvento = params.nombreEvento
                eventDB.fecha = params.fecha
                } 
          
            eventDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Evento editado'
                });
            })
     });
    }
    

}


export default eventoController;