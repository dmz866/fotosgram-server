import { IFileUpload } from './../interfaces/interfaces';
import { Post } from './../models/post.model';
import { verificarToken } from './../middlewares/autenticacion';
import { Router, Response } from "express";
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

postRoutes.get('/', async (request: any, response: Response) => 
{
    let pagina = Number(request.query.pagina) || 1;
    let skip = (pagina - 1) * 10;
    const posts = await Post.find().sort({ _id: -1}).skip(skip).limit(5).populate('usuario', '-password');
    
    return response.json({
        ok: true,
        pagina,
        posts
    });
});

postRoutes.post('/', verificarToken, (request: any, response: Response) => 
{
    const body = request.body;
    body.usuario = request.usuario._id;

    const imagenes = fileSystem.moverImagenesDeTempAPost(request.usuario._id);
    body.imgs = imagenes; 

    Post.create(body).then(async postDB => 
    {
        await postDB.populate('usuario', '-password').execPopulate();
        return response.json({
            ok: true,
            post: postDB
        });
    }).catch(error => {
        return response.json({
            ok: false,
            mensaje: error
        });
    }); 
});

postRoutes.post('/upload', verificarToken, async (request: any, response: Response) => 
{
    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
 
    const file: IFileUpload = request.files.image;

    if (!file) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
    }

    if (!file.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No se subio ninguna imagen'
        });
    }

    await fileSystem.guardarImagenTemporal(file, request.usuario._id);

    return response.json({
        ok: true,
        file: file.mimetype
    });
});

export default postRoutes;