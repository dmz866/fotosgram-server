import { IUsuario } from './../interfaces/interfaces';
import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contrasena es necesaria']
    }
});

usuarioSchema.method('compararPassword', function(password: string = ''): boolean {
    return (bcrypt.compareSync(password, this.password));
});

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);