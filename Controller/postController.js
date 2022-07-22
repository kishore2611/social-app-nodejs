const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../Models/Post");
const User = require("../Models/User");

//Post Route
const createPost = async (req, res) => {
    try {
        // console.log(req.body);
        if (!req.body.caption) {
            res.status(400)
            throw new Error('Please add Caption')
        }
        else{
            const post = new Post();

            post.caption = req.body.caption,
            post.img = {
                    publicId: "req.body.publicId",
                    url: "req.body.url"
                },
            post.owner = req.user._id
            console.log(req.body.caption);

            const uploadPost = await Post.create(post);

            const user = await User.findById(req.user._id);
            user.posts.push(uploadPost._id);
            await user.save();
            // console.log(req.user._id);

            if (uploadPost) {
                res.status(200).send({
                    message: 'Post Added Successfully',
                    uploadPost
                })
            }
            else {
                res.status(404).send('Something Went Wrong')
            }


            // const newPostData = {
            //     caption: req.body.caption,
            //     img: {
            //         publicId: "req.body.publicId",
            //         url: "req.body.url"
            //     },
            //     owner: req.body.user._id
            // }
        }
    }
    catch (err) {
        res.status(500).send(err)
    }
}



const likeAndUnlikePost = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(post);
        const post = await Post.findById( {_id: req.body._id} );

        if(!post) {
            res.status(404).send('Post not found')
        }
        // console.log("userid", req.user._id);

        if(post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();
            

            res.status(200).send('Post Unlike')
        }
        else {
        post.likes.push(req.user._id);

        await post.save();

        res.status(200).send('Post Liked')
        }
    }
    catch(err) {
        res.status(500).send({
            message: err + ': ' + "kdjfkjldshf"

        })
    }
}

//Comment on Post
const postComment = async (req, res) => {
    try {
        const post = await Post.findById(req.body._id)
        if(!post){
            res.status(400).send("Post not found")
        }

        let commentIndex = -1;

        post.comments.forEach((item, index) => {
            if(item.user.toString() === req.user._id.toString()) {
                commentIndex = index; 
            }
        });

        if(commentIndex !== -1){
            post.comments[commentIndex].comment = req.body.comment;
            await post.save();
            res.status(200).send("Comment Updated")
        }
        else{
        post.comments.push({
            user: req.user._id,
            comment: req.body.comment
        });
        await post.save();
        res.status(200).send("Comment added successfully")

        }
    }
    catch (err) {
        res.status(500).send(err)
    }
}

//Delete Comment
const deleteComment = async (req, res) => {
    try {

        const post = await Post.findById(req.body._id)
        if(!post) {
            return res.status(404).send("Comment not found")
        }   

        if(post.owner.toString() !== req.user._id.toString()){

            if(req.body.commentId == undefined){
                return res.status(400).send("Comment Id is required")
            }
            post.comments.forEach((item, index) => {
                if(item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            
            await post.save();
            return res.status(200).send("Selectd comment Deleted")
            
            
        }
        else{
            post.comments.forEach((item, index) => {
                if(item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();
            return res.status(200).send("Your comment Deleted")
        }
    }
    catch (err) {
        return res.status(500).send(err)
    }
}

//Delete Post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({ _id: req.body._id })
        
        if(!post) {
            return res.status(404).send('Post not found')
        }
        
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).send({
                message: 'Unathorized.'
            });
        }
        // else {
        //     res.status(400).send({
        //         status: 0,
        //         message: 'Something went wrong.'
        //     });
        // }

        await post.remove();

        const user = await User.findById(req.user._id)
        const index = user.posts.indexOf(req.body._id)
        user.posts.splice(index, 1);
        await user.save();

        res.status(200).send('Post Deleted')
    }
    catch(err) {
        res.status(500).send({
            message: err + ': ' + "Catch error"

        })
    }
}



// Get Post of following
const postOfFollowing = async (req, res) => {
    try {
        // const user = await User.findById(req.user._id).populate("followings", "posts");
        // res.status(200).send({
        //     followings: user.followings
        // })
        // console.log({
        //     followings: user.followings
        // });

        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.followings
            }
        })

        res.status(200).send({
            posts
        })
    }
    catch(err) {
        res.status(500).send({
            message: err + ': ' + "Catch error"

        })
    }
}


//Update Caption
const updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.body._id);

        if(!post) {
            res.status(400).send("Post not found");
        }

        if(post.owner.toString() !== req.user._id.toString()) {
            res.status(400).send("Unathorised post")
        }

        post.caption = req.body.caption;
        await post.save();
        res.status(200).send("Post Updated successfully")
    }
    catch (err) {
        res.status(404).send(err)
    }
}


module.exports = {
    createPost,
    likeAndUnlikePost,
    postComment,
    deleteComment,
    deletePost,
    postOfFollowing,
    updateCaption
}