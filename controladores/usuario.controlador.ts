import {Request, Response} from "express";
import Token from "../clases/token";
import { Usuario } from '../modelos/usuario.modelo';

class usuarioController{

getSaludo (req:Request, res:Response){
    
    const nombre = req.query.nombre || 'desconocid@';
    res.status(200).send({
        status: 'ok',
        mensaje:'hola, ' + nombre,
        dia: new Date()
    })
   
}
postDePrueba (req:Request, res:Response){
    let usuario = req.body;
    if(!usuario.usuario){
        res.status(200).send({
            status:'error',
            mensaje:'El usuario es necesario'
        })
    }
    res.status(200).send({
        status: 'ok',
        usuario: usuario
    })
    } 

   //Cargar usuarios propios
     mostrarUsuario(req: Request, res:Response){
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
                let usuario = usuarioDB.nombre;
                Usuario.find({ nombre: usuario }).then((usuariosDB)=>{
                    if(!usuariosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'Usuarios incorrectos'
                    })
                }                
                    const usuarioQueDevuelvo = new Array<any>();
                    usuarioQueDevuelvo.push(usuariosDB);
                    res.status(200).send({
                    status:'ok',
                    mensaje: 'Muestra de datos correcta',
                    usuario: usuarioQueDevuelvo,
                    token: Token.generaToken(usuario)
                });
            });
        }
    })
}

//Cargar usuarios tipo librero - libreria
mostrarLibreria(req: Request, res:Response){
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
                Usuario.find({ ciudad: ciudad}).then((usuariosLibrerosDB)=>{
                  
                    if(!usuariosLibrerosDB){
                        return res.status(200).send({
                        status:'error',
                        mensaje: 'Usuarios tipo librero incorrectos'
                    })
                }                
                    const usuarioLibreroQueDevuelvo = new Array<any>();
                    usuarioLibreroQueDevuelvo.push(usuariosLibrerosDB);
                    res.status(200).send({
                    status:'ok',
                    mensaje: 'Muestra de datos correcta',
                    usuario: usuarioLibreroQueDevuelvo,
                    token: Token.generaToken(usuarioDB)
                });
            });
        }
    })
}

registro(req:Request, res:Response){
   // Usuario
   let params = req.body;
   const usuarioNuevo= new Usuario();
   usuarioNuevo.nombre = params.nombre;
   usuarioNuevo.pwd = params.pwd;
   usuarioNuevo.email = params.email;
   usuarioNuevo.ciudad = params.ciudad;
   usuarioNuevo.sexo = params.sexo;
   usuarioNuevo.favoritos = params.favoritos;
   
   Usuario.create(usuarioNuevo).then((usuarioDB)=>{
       if(!usuarioDB){
           res.status(500).send({
               status:'error',
               mensaje:'Error al crear el usuario'
           })
       }
       res.status(200).send({
           status:'ok',
           mensaje:'Se ha creado el usuario' + usuarioDB.nombre,
           usuario: usuarioDB
       })
   }).catch(err=>{
       res.status(500).send({
           status: 'error',
           error: err
       })
   });
}
registroLibreria(req:Request, res:Response){
    // Usuario
    let params = req.body;
    const usuarioNuevo= new Usuario();
    usuarioNuevo.nombre = params.nombre;
    usuarioNuevo.ciudad = params.ciudad;
    usuarioNuevo.direccion = params.direccion;
    usuarioNuevo.telefono = params.telefono;
    usuarioNuevo.web = params.web;
    usuarioNuevo.email = params.email;
    usuarioNuevo.pwd = params.pwd;
    console.log(usuarioNuevo);
    
    Usuario.create(usuarioNuevo).then((usuarioDB)=>{
        if(!usuarioDB){
            res.status(500).send({
                status:'error',
                mensaje:'Error al crear el usuario'
            })
        }
        res.status(200).send({
            status:'ok',
            mensaje:'Se ha creado el usuario' + usuarioDB.nombre,
            usuario: usuarioDB
        })
    }).catch(err=>{
        res.status(500).send({
            status: 'error',
            error: err
        })
    });
 }
getUsuario(req:Request, res:Response){
    let _id = req.body.usuario._id;
    Usuario.findById(_id).then((usuarioDB)=>{
        if(!usuarioDB){
            return res.status(200).send({
                status:'error',
                mensaje: 'Token inválido'
            })
        }else{
            const usuarioQueDevuelvo = new Usuario();
            usuarioQueDevuelvo.nombre = usuarioDB.nombre;
            usuarioQueDevuelvo._id = usuarioDB._id;
            usuarioQueDevuelvo.ciudad = usuarioDB.ciudad;
    
            res.status(200).send({
                status:'ok',
                mensaje: 'Login correcto',
                usuario: usuarioQueDevuelvo,
                token: Token.generaToken(usuarioQueDevuelvo)
            })
        }
    });   
}

login(req:Request, res:Response){
    // Usuario
    let params = req.body;
    const nombreQueLlega = params.nombre;
    const pwdQueLlega = params.pwd;
    //buscar los usuarios que cumplan estas dos condiciones
    //con una promesa, si lo encuentra devuelve un usuario con unos datos concretos (no todos)
    Usuario.findOne({nombre:nombreQueLlega, pwd:pwdQueLlega}).then((usuarioDB)=>{
        if(!usuarioDB){
            return res.status(200).send({
                status:'error',
                mensaje: 'Usuario y/o contraseña incorrectas'
            })
        }
        const usuarioQueDevuelvo = new Usuario();
        usuarioQueDevuelvo.nombre = usuarioDB.nombre;
        usuarioQueDevuelvo._id = usuarioDB._id;
        usuarioQueDevuelvo.web = usuarioDB.web;
        usuarioQueDevuelvo.sexo = usuarioDB.sexo;

        res.status(200).send({
            status:'ok',
            menesaj: 'Login correcto',
            usuario: usuarioQueDevuelvo,
            token: Token.generaToken(usuarioQueDevuelvo)

        })
    }).catch(err=>{
        return res.status(500).send({
            status:'error',
            mensaje: 'Error en la BBDD',
            error:err
        })
    })  
 }
//Guardar datos personales editados del librero
 guardarDatosEditadosLibreria(req: Request, res:Response){
      let params = req.body;
        const idQueLlega = params._id;

        Usuario.findById(idQueLlega).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar los datos personales',
                }); 
            }
            if(usuarioDB.nombre !== params.nombre || usuarioDB.pwd !== params.pwd || usuarioDB.email !== params.email || usuarioDB.web !== params.web || usuarioDB.telefono !== params.telefono || usuarioDB.ciudad !== params.ciudad || usuarioDB.direccion !== params.direccion) {
                usuarioDB.nombre = params.nombre
                usuarioDB.pwd = params.pwd
                usuarioDB.email = params.email
                usuarioDB.web = params.web
                usuarioDB.telefono = params.telefono
                usuarioDB.ciudad = params.ciudad
                usuarioDB.direccion = params.direccion
                } 
          
            usuarioDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Datos personales editados'
                });
            })
        });
    }; 

//Guardar datos personales editados del bibliofilo
 guardarDatosEditadosBibliofilo(req: Request, res:Response){
     let params = req.body;
        const idQueLlega = params._id;

        Usuario.findById(idQueLlega).then(usuarioDB => {
            if (!usuarioDB) {
                return res.status(400).send({
                    status: 'error',
                    mensaje: 'Error al editar los datos personales',
                }); 
            }
            if(usuarioDB.nombre !== params.nombre || usuarioDB.pwd !== params.pwd || usuarioDB.ciudad !== params.ciudad || usuarioDB.sexo !== params.sexo) {
                usuarioDB.nombre = params.nombre
                usuarioDB.pwd = params.pwd
                usuarioDB.email = params.email
                usuarioDB.ciudad = params.ciudad
                usuarioDB.sexo = params.sexo
                } 
          
            usuarioDB.save().then( () => {
                res.status(200).send({
                    status: 'ok',
                    mensaje: 'Datos personales editados'
                });
            })
        });
   }; 

   //Guardar la libreria en favoritos
   guadarLibreriaFav(req: Request, res:Response){
    let params = req.body;
    const idQueLlega = params.usuario._id;
    const libreriaQueLlega = params.libreria;
    console.log(params);
    Usuario.findById(idQueLlega).then(usuarioDB => {
        if (!usuarioDB) {
            return res.status(400).send({
                status: 'error',
                mensaje: 'Error al traer el usuario',
            }); 
        }
        usuarioDB.favoritos.push(libreriaQueLlega);
        usuarioDB.save().then( () => {
            res.status(200).send({
                status: 'ok',
                mensaje: 'Datos ok'
            });
        })
    });

   }
}

export default usuarioController;