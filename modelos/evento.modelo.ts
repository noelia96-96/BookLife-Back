import { Schema, Document } from "mongoose";
import mongoose from 'mongoose';

//esquema - estructura de la tabla
const eventoSchema = new Schema({
    nombreEvento:{type:String, unique:true},
    creador:{type:String},
    direccion :{type:String},
    ciudad :{type:String},
    fecha:{type:Date},
    hora:{type:Date},
    participantes:[{type:String}]
},{
    timestamps:true
});

interface IEvento extends Document{
    nombreEvento:string,
    creador:string,
    direccion: string,
    ciudad: string,
    fecha:Date,
    hora: Date,
    participantes:string[]
}

//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
export const Evento = mongoose.model<IEvento>('Evento', eventoSchema);