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
            eventoNuevo.direccion = params.direccion;
            eventoNuevo.ciudad = params.ciudad;
            eventoNuevo.fecha = params.fecha;
            eventoNuevo.hora = params.hora;
            eventoNuevo.participantes = params.participantes;
            
            if(params.base64){
                //Guardar imagen
                var nombreImagen = 'imagen_evento' + Date.now();
                let base64 = params.base64;
                var splitted = base64.split(",", 1); 
                var base64Data = base64.replace(splitted, "");
                //Aqui es donde se va a guardar la imagen
                require("fs").writeFile("./img/"+nombreImagen+".png", base64Data, 'base64', function(err:any) {
                });
                //Ruta de la imagen
                var rutaImagen = 'https://proyecto-booklife.herokuapp.com/public/' + nombreImagen + '.png';
                
                //Guardar la url de la imagen antes de guardar el evento
                eventoNuevo.imagenEvento = rutaImagen;
            }
            Evento.create(eventoNuevo).then((eventoDB)=>{
                if(!eventoDB){
                    res.status(500).send({
                        status:'error',
                        mensaje:'Error al crear el evento'
                    })
                }
                res.status(200).send({
                    status:'ok',
                    mensaje:'Se ha creado el evento' + eventoDB.nombreEvento,
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
        console.log(req);
        let _id = req.body.usuario._id;
        let params = req.body;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
                 let ciudad = usuarioDB.ciudad;
                Evento.find({  ciudad: ciudad }).sort('fecha').limit(params.limite).then((eventosParaBibliofiloDB)=>{
                    if(!eventosParaBibliofiloDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'Eventos incorrectos'
                    })
                }
                    const eventosParaBibliofiloQueDevuelvo = new Array<any>();
                    eventosParaBibliofiloQueDevuelvo.push(eventosParaBibliofiloDB);
                    res.status(200).send({
                    status:'ok',
                    mensaje: 'Muestra de datos correcta',
                    evento: eventosParaBibliofiloQueDevuelvo,
                    token: Token.generaToken(usuarioDB)
                });
            });
        }
    })
}

//Cargar eventos por bibliofilo
getEventosPorBibliofilo(req: Request, res:Response){
     console.log(req);
        let _id = req.body.usuario._id;
        let params = req.body;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
                let ciudad = usuarioDB.ciudad;
                Evento.find({ ciudad: ciudad }).sort('fecha').limit(params.limite).then((eventosDB)=>{
                    if(!eventosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'Eventos incorrectos'
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
                    mensaje:'Error al borrar el evento'
                })
             }
             res.status(200).send({
                status:'ok',
                mensaje:'Se ha borrado el evento',
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
            let params = req.body;
            const idQueLlega = params._id;
        Evento.findOne({_id: params._id}).then(eventDB => {
            if (!eventDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al borrar el evento',
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
                    mensaje: 'Error al editar el evento',
                }); 
            }
            if(eventDB.nombreEvento !== params.nombreEvento || eventDB.direccion !== params.direccion || eventDB.ciudad !== params.ciudad || eventDB.fecha !== params.fecha || eventDB.hora !== params.hora) {
                eventDB.nombreEvento = params.nombreEvento
                eventDB.direccion = params.direccion
                eventDB.ciudad = params.ciudad
                eventDB.fecha = params.fecha
                eventDB.hora = params.hora
                } 
          
            eventDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Evento editado'
                });
            })
     });
    }

    mostrarEventosPicharCard(req: Request, res:Response){
        console.log(req);
        let _id = req.body.usuario._id;
        let params = req.body;
        let libreriaPinchada = params.libreriaPinchadaCard;
    
        Usuario.findById(_id).then((usuarioDB)=>{ 
                if(!usuarioDB){
                    return res.status(200).send({
                        status:'error',
                        mensaje: 'Token inválido'
                    })
                }else{
                    Evento.find({creador:libreriaPinchada}).then((eventosDB)=>{
                        if(!eventosDB){
                            return res.status(200).send({
                            status:'error',
                            mensaje: 'Muestra incorrecta de los eventos'
                        })
                    }                
                        const eventosQueDevuelvo = new Array<any>();
                        eventosQueDevuelvo.push(eventosDB);
                        res.status(200).send({
                        status:'ok',
                        mensaje: 'Muestra de datos correcta',
                        evento: eventosQueDevuelvo,
                        token: Token.generaToken(usuarioDB)
                    });
                });
            }
        })

    }

    
}

export default eventoController;