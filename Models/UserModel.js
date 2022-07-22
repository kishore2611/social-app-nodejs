// const mongoose = require("mongoose");

// const userScheme = new mongoose.Schema({
//     name: {
//         type: String,
//         require: true
//     },
//     avatar: {
//         public_id: String,
//         url: String,
//     },
//     email: {
//         type: String,
//         require: true,
//         unique: true,
//         match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
//     },
//     password: {
//         type: String,
//         require: true,
//         //minlength: ["Password must be atleast 6 characters"],
//         // select: false,
//     },
//     posts: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Post",
//         },
//     ],
//     followers: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//         },
//     ],
//     following: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//         },
//     ],
//     user_image: {
//         type: String,
//         required: false,
//         default: null,
//     },
//     code: {
//         type: Number,
//         default: null
//     },
//     verified: {
//         type: Number,
//         default: 0
//     },
//     is_blocked: {
//         type: Number,
//         default: 0
//     },
// },
//     { timestamps: true }
// );
// const User = mongoose.model('User', userScheme);
// module.exports = User;