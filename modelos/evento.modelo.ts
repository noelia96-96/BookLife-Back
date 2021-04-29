import { Schema, Document } from "mongoose";
import mongoose from 'mongoose';

//esquema - estructura de la tabla
const eventoSchema = new Schema({
    nombreEvento:{type:String, unique:true},
    creador:{type:String},
    lugar:{type:String},
    fecha:{type:Date},
    hora:{type:Date},
    //minutos:{type:Number},
    participantes:[{type:String}]
},{
    timestamps:true
});

interface IEvento extends Document{
    nombreEvento:string,
    creador:string,
    lugar: string,
    fecha:Date,
    hora: Date,
    //minutos: Number,
    participantes:string[]
}

//modelo de mongoose - que trabaja sobre la tabla Usuario con esquema usuarioSchema
export const Evento = mongoose.model<IEvento>('Evento', eventoSchema);