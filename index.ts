import Server from "./classes/server";
import userRoutes from "./routes/usuario";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from "./routes/post";
import fileUpload from 'express-fileupload';

const server = new Server();

//MIDDLEWARE
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

server.app.use(fileUpload());

server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

mongoose.connect('mongodb://localhost:27017/fotosgram', 
                { useNewUrlParser: true, useCreateIndex: true}, 
                (error) => 
{
    if (error) {
        throw error;
    }

    console.log('BDD ONLINE');
});

server.start(() => 
{
    console.log(`Servidor corriendo en puerto ${server.port}`);
});