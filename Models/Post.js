const mongoose = require('mongoose');
const User = require('../Models/User');


const postSchema = mongoose.Schema({
    caption: {
        type: 'string',
        require: true
    },
    img:{
        publicId: 'String', 
        url: 'String'
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    createDate:{
        type: Date,
        default: Date.now()
    },
    likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    }],
    comments:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: 'String',
            require: true
        }
    }]
},
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

