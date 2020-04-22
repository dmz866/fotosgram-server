import jwt from 'jsonwebtoken';

export default class Token {
    private static seed: string = 'este-es-mi-seed-de-mi-app-secreto';
    private static caducidad: string ='30d';

    public static getJwtToken(payload: any) {
        return jwt.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    }

    public static comprobarToken(userToken: string) {
        return new Promise((resolve, reject) => 
        {
            jwt.verify(userToken, this.seed, (error, decoded) => 
            {
                if (error) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });        
    } 
}