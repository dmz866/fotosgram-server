import { IPost } from './../interfaces/interfaces';
import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    imgs: [{
        type: String
    }],
    coords: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});

postSchema.pre<IPost>('save', function(next) {
    this.created = new Date();
    next();
});

export const Post = model<IPost>('Post', postSchema);