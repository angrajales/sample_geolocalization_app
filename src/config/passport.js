/*const LocalStrategy = require('passport-local').Strategy;
const AuthStrategy = require('passport-auth0').Strategy;

const User = require('./../app/models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })
    // Regsitro
    passport.use('auth0-signup', new AuthStrategy({
        domain: "dev-1dbrzis6.auth0.com",
        clientID: "b5699POFj7hTQveOTmaDU4DCYieZHQzU",
        clientSecret: "mb55RSD27kyTZkDu2hR_KCoRp123wT7czSlUUuiDvSSMs6wwOH6dQtWyaBZI0N1Z",
        callbackURL: "/callback"
    },
    function(req, email, password, done){
        User.findOne({
            'local.email': email
        }, function(err, user) {
            if(err) {return done(err);}
            if(user){
                return done(null, false, {signupMessage:'El correo ya existe.'});
            }else{
                var newUser = new User();
                newUser.local.email = email;
                if(!(password == req.param('confirmation'))){
                    return done(null, false, {signupMessage:'Las claves no coinciden.'});
                }
                newUser.local.password = newUser.generateHash(password);
                newUser.local.fullName = req.param('fullname');
                newUser.save(function(err) {
                    if(err){
                        throw err;
                    }
                    return done(null, newUser);
                })

            }
        })
    }
    ));
    // Inicio
    passport.use('auth0-signin', new AuthStrategy({
        domain: "dev-1dbrzis6.auth0.com",
        clientID: "b5699POFj7hTQveOTmaDU4DCYieZHQzU",
        clientSecret: "mb55RSD27kyTZkDu2hR_KCoRp123wT7czSlUUuiDvSSMs6wwOH6dQtWyaBZI0N1Z",
        callbackURL: "/callback"
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        User.findOne({
            'local.email': email
        }, function(err, user) {
            if(err) {return done(err);}
            if(!user){
                return done(null, false, {loginMessage: 'El usuario no se encuentra en la base de datos.'});
            }
            if(!user.validatePassword(password)){
                return done(null, false, {loginMessage: 'La clave o usuario son incorrectos.'});
            }
            return done(null, user);
        });
        return done(null, profile);
    }));
}
*/
module.exports = function () {
    return function secured (req, res, next) {
        if (req.user) { return next(); }
        req.session.returnTo = req.originalUrl;
        res.redirect('/');
    };
};