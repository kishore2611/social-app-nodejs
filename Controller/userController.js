const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Post = require("../Models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// //Update user
// const updateUser = async (req, res) => {
//     try{
//         // const userupdate = await User.findById({ _id: req.body._id })
//         if(req.body._id === req.params.id){
//             const userupdate = await User.findById({ _id: req.body._id })
//             userupdate.carName = req.body.carName,
//             userupdate.carNumber = req.body.carNumber,
//             userupdate.modelNumber = req.body.modelNumber
//         }
//         else{
//             res.status(404).json("You can only update your account!");
//         }

//     }
//     catch (error) {
//         res.status(400).send(error)
//     }
// }


// // Delete user
// // Get user
// // Follow user
const followUser = async (req, res) => {
    try{
        const userToFollow = await User.findById(req.body._id)
        const loggedInUser = await User.findById(req.user._id)

        // console.log(userToFollow);

        if(!userToFollow){
            res.status(400).send("User not found")
        }
        if(loggedInUser.followings.includes(userToFollow._id)){

            const indexfollowing = loggedInUser.followings.indexOf(userToFollow._id)
            const indexfollower = userToFollow.followers.indexOf(loggedInUser._id)

            loggedInUser.followings.splice(indexfollowing, 1)
            userToFollow.followers.splice(indexfollower, 1)

            await userToFollow.save()
            await loggedInUser.save()


            res.status(200).send("User UnFollowed successfully")

        }
        else{
            loggedInUser.followings.push(userToFollow._id)
            userToFollow.followers.push(loggedInUser._id)
    
            loggedInUser.save()
            userToFollow.save()
    
            res.status(200).send("User Followed successfully")
        }



    }
    catch(err){
        res.status(400).send({
            message: err + ': ' + "Catch error"
        })
    }
}

//Update password
const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");

        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword) {
            res.status(400).send("Please Provide old and new password");
        }
        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch) {
            res.status(400).send("incorrect old password")
        }

        user.password = newPassword;
        await User.save();

        res.status(200).send("Password updated successfully")
    }
    catch(err){
        res.status(400).send(err)
    }
}

//update Profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const {name, email} = req.body;

        if(name){
            user.userName = name;
        }
        if(email){
            user.email = email;
        }

        await User.save();

        res.status(200).send("Profile updated successfully")
    }
    catch(err){
        res.status(404).send(err);
    }
}

// Delete My Profile
const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        await User.remove();

        //logout after deleting profile
        // res.status(200).Cookies("token", null, {expires: new Date(Date.now()), httpOnly: true});

        //delete all posts of the user
        for (let i=0; i<posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove();
        }

        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i])
            const index = follower.following.indexOf(userId)
            follower.followings.splice(index, 1)
            await follower.save()
        }
        // removing user from following's  follower
        for (let i = 0; i < followings.length; i++) {
            const follows = await User.findById(following[i])
            const index = follows.followings.indexOf(userId)
            follows.following.splice(index, 1)
            await follows.save()
        }

        res.status(200).send("Profile deleted")
    }
    catch(err){
        res.status(404).send({
            message: err + ':' + "Catch error"
        })
    }
}



module.exports = {
    followUser,
    updatePassword,
    updateProfile,
    deleteProfile
}