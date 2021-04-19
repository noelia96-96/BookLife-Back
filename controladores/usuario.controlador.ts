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

registro(req:Request, res:Response){
   // Usuario
   let params = req.body;
   const usuarioNuevo= new Usuario();
   usuarioNuevo.nombre = params.nombre;
   usuarioNuevo.pwd = params.pwd;
   usuarioNuevo.email = params.email;
   usuarioNuevo.ciudad = params.ciudad;
   usuarioNuevo.sexo = params.sexo;
   
   Usuario.create(usuarioNuevo).then((usuarioDB)=>{
       if(!usuarioDB){
           res.status(500).send({
               status:'error',
               mensaje:'error al crear el usuario'
           })
       }
       res.status(200).send({
           status:'ok',
           mensaje:'se ha creado el usuario' + usuarioDB.nombre,
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
        //usuarioQueDevuelvo.email = usuarioDB.email;//

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

};

export default usuarioController;