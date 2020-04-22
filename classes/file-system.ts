import { IFileUpload } from './../interfaces/interfaces';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    moverImagenesDeTempAPost(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPosts = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if (!fs.existsSync(pathTemp)) {
            return [];
        }

        if (!fs.existsSync(pathPosts)) {
            fs.mkdirSync(pathPosts);            
        }

        const imagenesTemp = this.getImagenesEnCarpeta(pathTemp);
        imagenesTemp.forEach(imagen => 
        {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPosts}/${imagen}`);    
        });

        return imagenesTemp;
    }

    private getImagenesEnCarpeta(path: string) {
        return fs.readdirSync(path) || [];
    }

    guardarImagenTemporal(file: IFileUpload, userId: string) {
        return new Promise((resolve, reject) => 
        {
            const path = this.crearCarpetaUsuario(userId);
            const nombreArchivo = this.generarNombreArchivo(file.name);
    
            file.mv(`${path}/${nombreArchivo}`, (error: any) => 
            {
                if (error) {
                    reject();
                }
                else {
                    resolve();
                }                
            });
        });                        
    }

    private generarNombreArchivo(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const ext = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid();

        return `${idUnico}.${ext}`;
    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';

        if(!fs.existsSync(pathUser)) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }
}