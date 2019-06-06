const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const googleMapsClient = require('@google/maps');
//const leaflet = require("leaflet");


const dbconf = require('./config/db');
console.log(process.env['NODE_ENV']);
const enviroment = process.env['NODE_ENV'] || "dev";

var url = dbconf[enviroment].url;
mongoose.connect(url, function(err){
    if(!err){
        console.log("Connection to db has been executed successfully");
    }else{
        console.log(`There's a problem with the db ${JSON.stringify(err)}`);
    }
});
require('./config/passport')(passport);

// Settings
if(process.env.AWS){
    app.set('port', 80);    
}else{
    app.set('port', process.env.PORT || 80);
}
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'dog',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Services

require('./app/services')(app, passport);

// Static files

app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
    console.log(`Sever running at ${app.get('port')}`);
});
