import { Document } from "mongoose";

export interface IUsuario extends Document {
    nombre: string;
    avatar: string;
    email: string;
    password: string;

    compararPassword(password: string): boolean;
}

export interface IPost extends Document {
    created: Date;
    mensaje: string;
    imgs: string[];
    coords: string;
    usuario: string;
}

export interface IFileUpload {
    name: string;
    data: any;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;

    mv: Function;
}