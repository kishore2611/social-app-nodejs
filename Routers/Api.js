// const { Router } = require("express");
const router = require('express').Router(); 
const verify = require('jsonwebtoken/verify');
const { SignUp, LogIn, logOut } = require("../Controller/authController");
const { followUser, updatePassword, updateProfile, deleteProfile } = require('../Controller/userController');
const { createPost, likeAndUnlikePost, deletePost, postOfFollowing, updateCaption, postComment, deleteComment } = require('../Controller/postController');
const { verifyToken } = require('../middleware/Authentication');
const { upload } = require('../Middleware/multer');




//Authentication
router.post('/signUp', upload.single("profilePicture"), SignUp);
router.post('/logIn', LogIn);
router.get('/logOut', logOut);
router.delete('/deleteProfile',verifyToken, deleteProfile);



// Follow and Following Users
router.get('/followUser',verifyToken, followUser);
router.put('/updatePassword',verifyToken , updatePassword);
router.put('/updateProfile',verifyToken , updateProfile);


//Post
router.post('/createPost',verifyToken , createPost);
router.get('/likeAndUnlikePost',verifyToken , likeAndUnlikePost);
router.post('/postComment',verifyToken , postComment);
router.delete('/deleteComment',verifyToken , deleteComment);
router.delete('/deletePost',verifyToken , deletePost);
router.get('/postOfFollowing',verifyToken , postOfFollowing);
router.put('/updateCaption',verifyToken , updateCaption);




// router.post('/uploadImage', imageUpload.single('image'), (req, res) => {
//     res.send(req.file)
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })


module.exports = router;