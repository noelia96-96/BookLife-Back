import { NextFunction } from "express";
import Token from '../clases/token';

export const  autenticacion = (req:any, res:any, next:NextFunction)=>{
    let userToken:string = req.get('Authorization') ||'';
    
    userToken = userToken.split('Bearer ')[1];
    Token.verificaToken(userToken).then((decoded:any)=>{
        req.body.usuario = decoded.usuario;
        next();
    }).catch(err=>{
        console.log('hay error aqui', err);
        if(err.message=='invalid token'){
            res.status(200).json({
            status:'error',
            mensaje: 'Token inválido'
        });
        }
        else{
            res.status(200).json({
                status:'error',
                mensaje: 'Sesión caducada'
            });
        }
        
    });
}