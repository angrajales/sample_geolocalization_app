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

const AuthStrategy = require('passport-auth0').Strategy;
const userInViews = require('./config/userInViews');

const dbconf = require('./config/db');
const enviroment = "prod";

console.log(enviroment);

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

var strategy = new AuthStrategy(
    {
      domain: "dev-1dbrzis6.auth0.com",
      clientID: "b5699POFj7hTQveOTmaDU4DCYieZHQzU",
      clientSecret: "mb55RSD27kyTZkDu2hR_KCoRp123wT7czSlUUuiDvSSMs6wwOH6dQtWyaBZI0N1Z",
      callbackURL: "/callback"
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
);
passport.use(strategy);
passport.serializeUser(function (user, done) {
    done(null, user);
});  
passport.deserializeUser(function (user, done) {
    done(null, user);
});
//app.use(userInViews());
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


app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`Sever running at ${app.get('port')}`);
});
