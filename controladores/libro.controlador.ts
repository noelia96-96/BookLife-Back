import {Request, Response} from "express";
import Token from "../clases/token";
import { Libro } from '../modelos/libro.modelo';
import { Usuario } from '../modelos/usuario.modelo';

class libroController{
    registrarLibro(req:Request, res:Response){
        console.log(req)
        let _id = req.body.usuario._id;
        Usuario.findById(_id).then((usuarioDB)=>{ 
            if(!usuarioDB){
                return res.status(200).send({
                    status:'error',
                    mensaje: 'Token inválido'
                })
            }else{            
            let usuario = usuarioDB.nombre;

            // Libros
            let params = req.body;
            const libroNuevo= new Libro();
            libroNuevo.nombreLibro = params.nombreLibro;
            //el creador se recupera de la BBDD directamente a la hora de hacer el registro
            libroNuevo.creador = usuario;
            libroNuevo.genero = params.genero;
            libroNuevo.autor = params.autor;
            libroNuevo.precio = params.precio;
            libroNuevo.participantes = params.participantes;

            //Guardar imagen
            if(params.base64){
                var nombreImagen = 'imagen_libro' + Date.now();
                let base64 = params.base64;
                var splitted = base64.split(",", 1); 
                var base64Data = base64.replace(splitted, "");
                //Aqui es donde se va a guardar la imagen
                require("fs").writeFile("./img/"+nombreImagen+".png", base64Data, 'base64', function(err:any) {
                });
                //Ruta de la imagen
                var rutaImagen = 'https://proyecto-booklife.herokuapp.com/public/' + nombreImagen + '.png';
                
                //Guardar la url de la imagen antes de guardar el evento
                libroNuevo.imagenLibro = rutaImagen;
            }
            console.log(params)
            Libro.create(libroNuevo).then((libroDB)=>{
                if(!libroDB){
                    res.status(500).send({
                        status:'error',
                        mensaje:'Error al publicar el libro'
                    })
                }
                res.status(200).send({
                    status:'ok',
                    mensaje:'Se ha publicado el libro' + libroDB.nombreLibro,
                    libro: libroDB
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
     //Cargar libros propios
     getLibros(req: Request, res:Response){
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
                Libro.find({ creador: usuario }).sort('nombreLibro').limit(params.limite).then((librosDB)=>{
                    if(!librosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'Libros incorrectos'
                        })
                    }
                    const librosQueDevuelvo = new Array<any>();
                    librosQueDevuelvo.push(librosDB);
                    res.status(200).send({
                    status:'ok',
                    mensaje: 'Muestra de datos correcta',
                    libro: librosQueDevuelvo,
                    token: Token.generaToken(librosQueDevuelvo)
                });
            });
        }
    })
}

//Mostrar libros al bibliofilo
    mostrarLibros(req: Request, res:Response){
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
                Usuario.find({ ciudad: ciudad }).then((usuariosDB)=>{
                    if(!usuariosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'Usuarios incorrectos'
                        })
                    }
                    const nombreLibreros = new Array<string>();
                    usuariosDB.forEach(function (value) {
                        nombreLibreros.push(value.nombre) 
                    });
                    Libro.find({creador:{$in:nombreLibreros}}).then((librosDB)=>{
                        
                        if(!usuariosDB){
                            return res.status(200).send({
                            status:'error',
                            mensaje: 'Libros incorrectos'
                            })
                        }
                        const librosQueDevuelvo = new Array<any>();
                        librosQueDevuelvo.push(librosDB);
                        res.status(200).send({
                        status:'ok',
                        mensaje: 'Muestra de datos correcta',
                        libro: librosQueDevuelvo,
                        token: Token.generaToken(librosQueDevuelvo)
                        });
                    });
                })
            }
        })
    }
    
    borrar(req: Request, res:Response){
        let params = req.body;
        Libro.findByIdAndRemove(params._id).then((libroDB)=>{
            if(!libroDB){
                res.status(500).send({
                  status:'error',
                    mensaje:'Error al borrar el libro'
                })
             }
             res.status(200).send({
                status:'ok',
                mensaje:'Se ha borrado el libro',
                libro: libroDB
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
            Libro.findOne({_id: params._id}).then(libroDB => {
                if (!libroDB) {
                    return res.status(400).send({
                        status: 'error',
                        mensaje: 'El libro no existe',
                    }); 
                }
                if(libroDB.participantes.length === 4) {
                    return res.status(200).send({
                        status: 'error',
                        mensaje: 'El libro ya ha sido reservado',
                    }); 
                }else{
                    libroDB.participantes.push(usuario);
                }
                libroDB.save().then( () => {
                    res.status(200).send({
                        status: 'ok',
                        mensaje: 'Libro actualizado'
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

    quitarReserva(req: Request, res:Response){
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
        Libro.findOne({_id: params._id}).then(libroDB => {
            if (!libroDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al borrar el libro',
                }); 
            }

            var indice = libroDB.participantes.indexOf(usuario);
            libroDB.participantes.splice(indice,1);

            libroDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Libro actualizado'
                });
            })
         });
        }
    })
}

    //Recupera el libro para editarlo
    buscarLibro(req: Request, res:Response){
        let params = req.body;
        const idQueLlega = params._id;
        Libro.findById(idQueLlega).then((librosDB)=>{
             if(!librosDB){
                 return res.status(200).send({
                    status:'error',
                    mensaje: 'Búsqueda fallida'
                 })
             }
             const librosQueDevuelvo = new Array<any>();
             librosQueDevuelvo.push(librosDB);
             res.status(200).send({
                status:'ok',
                mensaje: 'Búsqueda de libros exitosa',
                libro: librosQueDevuelvo,
                token: Token.generaToken(librosQueDevuelvo)
             });
        });
    }

    //Guardar libro editado
    guardarDatosEditados(req: Request, res:Response){
        let params = req.body;
        const idQueLlega = params._id;

        Libro.findById(idQueLlega).then(libroDB => {
            if (!libroDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar el libro',
                }); 
            }
            if(libroDB.nombreLibro!== params.nombreLibro || libroDB.genero !== params.genero || libroDB.autor !== params.autor || libroDB.precio !== params.precio) {
                libroDB.nombreLibro = params.nombreLibro
                libroDB.genero = params.genero
                libroDB.autor = params.autor
                libroDB.precio = params.precio
                } 
          
            libroDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Libro editado'
                });
            })
     });
    }

    reservarLibro(req: Request, res:Response){
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
                const nombreLibroQueLlega = params.nombreLibro;
                Libro.findOne({nombreLibro: params.nombreLibro}).then(libroDB => {
                    if (!libroDB) {
                        return res.status(400).send({
                            status: 'error',
                            mensaje: 'El libro no existe',
                        }); 
                    }
                    if(libroDB.participantes.length === 1) {
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'El libro ya ha sido reservado',
                        }); 
                    }else{
                        libroDB.participantes.push(usuario);
                    }
                    libroDB.save().then( () => {
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Reserav de libro actualizada'
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

    quitarReservaLibro(req: Request, res:Response){
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
            const nombreLibroQueLlega = params.nombreLibro;
        Libro.findOne({nombreLibro: params.nombreLibro}).then(libroDB => {
            if (!libroDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al cancelar reserva del libro',
                }); 
            }

            var indice = libroDB.participantes.indexOf(usuario);
            libroDB.participantes.splice(indice,1);

            libroDB.save().then( () => {
                        res.status(200).send({
                            status: 'ok',
                            mensaje: 'Libro actualizado'
                        });
                    })
                });
            }
        })
    }

    mostrarLibrosPicharCard(req: Request, res:Response){
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
                    Libro.find({creador:libreriaPinchada}).then((librosDB)=>{
                        if(!librosDB){
                            return res.status(200).send({
                            status:'error',
                            mensaje: 'Muestra incorrecta de los libros'
                        })
                    }                
                        const librosQueDevuelvo = new Array<any>();
                        librosQueDevuelvo.push(librosDB);
                        res.status(200).send({
                        status:'ok',
                        mensaje: 'Muestra de datos correcta',
                        libro: librosQueDevuelvo,
                        token: Token.generaToken(usuarioDB)
                    });
                });
            }
        })

    }
}


export default libroController;