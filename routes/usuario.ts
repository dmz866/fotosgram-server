import { verificarToken } from './../middlewares/autenticacion';
import { Usuario } from './../models/usuario.model';
import { Router, Request, Response } from "express";
import { IUsuario } from "../interfaces/interfaces";
import bcrypt from 'bcrypt'
import Token from '../classes/token';

const userRoutes = Router();

userRoutes.post('/login', (request: Request, response: Response) => 
{
    Usuario.findOne({email: request.body.email}, (error, userDB) => 
    {
        if (error) {
            throw error;
        }

        if (!userDB) {
            return response.json({
                ok: false,
                mensaje: 'Usuario/Contrasena incorrecta'
            });
        }

        if(userDB.compararPassword(request.body.password)) {
            const userToken = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            
            return response.json({
                ok: true,
                token: userToken
            });
        }
        else {
            return response.json({
                ok: false,
                mensaje: 'Usuario/Contrasena incorrecta ***'
            });
        }
    });
});

userRoutes.get('/prueba', (request: Request, response: Response) => 
{
    response.json({
        ok: true,
        mensaje: 'Todo belen'
    });
});

userRoutes.post('/create',  (request: Request, response: Response) => 
{
    const user = { 
        nombre: request.body.nombre,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 10),
        avatar: request.body.avatar
    };

    Usuario.create(user).then(userDB => 
    {
        const userToken = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        
        return response.json({
            ok: true,
            token: userToken
        });
        
    }).catch(error => 
    {
        return response.json({
                ok: false,
                error
            }); 
    });
});

userRoutes.post('/update', verificarToken, (request: any, response: Response) => 
{
    const user = {
        nombre: request.body.nombre || request.usuario.nombre,
        email: request.body.email || request.usuario.email,
        avatar: request.body.avatar || request.usuario.avatar
    };

    Usuario.findByIdAndUpdate(request.body._id, user, { new: true }, (error, userDB) => 
    {
        if (error) {
            throw error;
        }

        if (!userDB) {
            return response.json({
                ok: false,
                mensaje: 'No existe un usuario con ese id'
            });
        }

        const userToken = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        
        return response.json({
            ok: true,
            token: userToken
        });
    });
});

export default userRoutes;