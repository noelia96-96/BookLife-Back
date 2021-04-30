import { Schema, Document } from "mongoose";
import mongoose from 'mongoose';

//esquema - estructura de la tabla
const libroSchema = new Schema({
    creador:{type:String},
    nombreLibro:{type:String, unique:true},
    genero:{type:String},
    autor:{type:String},
    precio:{type:String},
    participantes:[{type:String}]
},{
    timestamps:true
});

interface ILibro extends Document{
    creador:string,
    nombreLibro:string,
    genero: string,
    autor: string,
    precio: string,
    participantes:string[]
}

//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
export const Libro = mongoose.model<ILibro>('Libro', libroSchema);