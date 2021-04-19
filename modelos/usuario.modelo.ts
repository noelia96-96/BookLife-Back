import { Schema, Document } from "mongoose";
import mongoose from 'mongoose';
//esquema - estructura de la tabla
const usuarioSchema = new Schema({
    nombre:{type:String, unique:true},
    pwd:{type:String},
    email:{type:String, unique:true},
    ciudad:{type:String},
    sexo:{type:String}
},{
    timestamps:true
});

interface IUsuario extends Document{
    nombre:string,
    pwd:string,
    email:string,
    ciudad:string,
    sexo:string
}

//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);