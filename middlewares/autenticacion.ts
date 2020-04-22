import { Request, Response, NextFunction } from 'express';
import Token from '../classes/token';

export const verificarToken = (request: any, response: Response, next: NextFunction) => {
    const userToken = request.get('x-token') || '';
    
    Token.comprobarToken(userToken).then((decoded: any) => {
        request.usuario = decoded.usuario;
        next();
    }).catch(error => {
        return response.json({
            ok: false,
            mensaje: 'Token incorrecto'
        });
    });
};