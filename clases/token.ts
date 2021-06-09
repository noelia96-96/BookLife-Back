import jwt from 'jsonwebtoken';
require('dotenv').config();
export default class Token{

    public static secreto:any = process.env.SECRETO;
    public static caducidad:string = '365d';//'365d'
    constructor(){}

    static generaToken(payload:any):string{
        //firmar token con clave secreta
        const miToken = jwt.sign({usuario:payload},Token.secreto,{expiresIn:Token.caducidad});
        return miToken;
    }

    static verificaToken(token:string){
        return new Promise((resolve, reject)=>{
            jwt.verify(token, Token.secreto, (err:any, decoded:any)=>{
               if(err){
                console.log('token invalido');
                reject(err);
            }
            else{
                resolve(decoded);
            } 
            })   
        }); 
    }
    
}