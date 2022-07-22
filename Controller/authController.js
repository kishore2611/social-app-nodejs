const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SihnUp Route
const SignUp = async (req, res) => {
    if(!req.body.userName){
        res.status(400).send('UserName Required')
    }
    else if(!req.body.email){
        res.status(400).send('Email Required')
    }
    else if(!req.body.password){
        res.status(400).send('Password Required')
    }
    else{
        await User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(400).send('Email Already Exists!')
            }
            else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(400).send(err)
                    }
                    
                    
                    // console.log(req.file);
                    else{
                        if (req.file) {
                            profilePicture = req.file.path
                        }
                        const user = new User;
                        user.userName = req.body.userName;
                        user.email = req.body.email;
                        user.password = hash;
                        // user.profilePicture = req.body.profilePicture;
                        // user.confirmPassword = req.body.confirmPassword;
                        user.profilePicture =  (req.file ? req.file.path : req.body.profilePicture)
                        user.save();
                        return res.status(201).send({
                            message: 'User Registered',
                            data: user
                        })
                        // console.log(user);
                    }
                })
            }
        })
        .catch(err => {
            res.status(400).send({
                status: 0,
                message: err
            });
        });
    }
}


//LogIn
const LogIn = async (req, res) => {
    if(!req.body.email){
        return res.status(400).send('email required')
    }
    else if(!req.body.password){
        return res.status(400).send('password required')
    }
    else{
        User.find({ email: req.body.email })
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(404).send('User not found')
            }
            else{
                console.log(req.body);
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if(err){
                        return res.status(400).send('Auth Failed')
                    }
                    if(result){
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                // password: user[0].password,
                                userId: user[0]._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "23hr" 
                                // new Date(Date.now()+90*24*60*60*1000)
                            }
                        );
                        return res.status(200).send({
                            status: 1, 
                            message: 'User logged in successfully!' ,
                            token: token,
                            data: user[0]
                        })
                    }
                    return res.status(400).send({
                        status: 0, 
                        message: 'Incorrect password.' 
                    });
                    
                })
            }
        })
        .catch(err => {
            res.status(400).send({
                status: 0, 
                message: err 
            });
        });
    }
};


const logOut = async (req, res) => {
    try {
        // console.log(req.body);
        return res.status(200).cookies("token", null, {expires: new Date(Date.now()), httpOnly: true}).send({
            status: 1, 
            message: 'User logged Out successfully!' 
            // token: null
        })
    }
    catch (err) {
        res.status(400).send({
            message: err.message + ":" + "Catch error"
        })
    }
}

module.exports = {
    SignUp,
    LogIn,
    logOut
}