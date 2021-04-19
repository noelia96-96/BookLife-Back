import { Schema, Document } from "mongoose";
import mongoose from 'mongoose';
//esquema - estructura de la tabla
const usuarioSchema = new Schema({
    nombre:{type:String, unique:true},
    email:{type:String, unique:true},
    pwd:{type:String},
    edad:{type:Number}
},{
    timestamps:true
});

interface IUsuario extends Document{
    nombre:string,
    email:string,
    pwd:string,
    edad:number
}

//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);