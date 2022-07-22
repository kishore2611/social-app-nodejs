const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

//body parser which return a JSON object
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use('/uploads', express.static('uploads'));

//PORT from .env file
const PORT = process.env.PORT || 9999;
dotenv.config();    

//Database Connection......
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }, () => console.log('DataBase Connected')
);


//Api Routes
const apiRoutes = require('./Routers/Api');
app.use('/api',apiRoutes);

//Server Listen......
app.listen(PORT, () => console.log('Server running on', PORT));