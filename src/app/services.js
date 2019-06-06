const Location = require('./models/location');
const LocationControler = require('./controllers/location-controller');
const secured = require('../config/passport');
var URL = require('url').URL;
var util = require('util');
var querystring = require('querystring');


module.exports = (app, passport) => {
    app.get('/', (req, res) => {
        res.render('index');
    });
    app.get('/login', passport.authenticate('auth0', {
        scope: 'openid email profile'
    }), (req, res) => {
        res.redirect('/');
    });
    app.get('/callback', (req, res, next) => {
        passport.authenticate('auth0', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                const returnTo = req.session.returnTo;
                delete req.session.returnTo;
                res.redirect(returnTo || '/location');
            });
        })(req, res, next);
    });
    app.get('/logout', (req, res) => {
        req.logout();
        var returnTo = req.protocol + '://' + req.hostname;
        var port = req.connection.localPort;
        if (port !== undefined && port !== 80 && port !== 443) {
            returnTo += ':' + port;
        }
        var logoutURL = new URL(
            util.format('https://%s/v2/logout', "dev-1dbrzis6.auth0.com")
        );
        var searchString = querystring.stringify({
            client_id: "b5699POFj7hTQveOTmaDU4DCYieZHQzU",
            returnTo: returnTo
        });
        logoutURL.search = searchString;
        res.redirect(logoutURL);
      });
    //app.post('/login', passport.authenticate('local-login'));
    /*app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });*/
    /*app.post('/signup', passport.authenticate('auth0-signup', {
        successRedirect: '/location',
        failureRedirect: '/signup',
        failureFlash: true
    }));*/

    /*app.post('/login', passport.authenticate('auth0-signin', {
        successRedirect: '/location',
        failureRedirect: '/login',
        failureFlash: true
    }));*/

    app.get('/location', secured(), (req, res) => {
        
        const { _raw, _json, ...userProfile } = req.user;
        res.locals.user = _json;
        LocationControler.findLocation(_json.email, (err, locs) => {
            if(err){
                res.render('location', {
                    user: res.locals.user,
                    locations: []
                });
            }else {
                console.log(locs);
                res.render('location', {
                    user: res.locals.user,
                    locations: JSON.stringify(locs)
                });
            }
        });
    });
    app.post('/location/register', secured(), (req, res) => {
        var data = {};
        data.latitude = req.body.latitude;
        data.longitude = req.body.longitude;
        data.user = req.body.user;
        LocationControler.findSpecLocation(data, (err, loc) => {
            if(!err){
                if(loc == null){
                    LocationControler.saveLocation(data, (er, lc) => {
                        if(!er){
                            console.log("Loc saved");
                        }
                    });
                }
            }
        });
    });

    app.get('/location/register', secured(), (req, res) => {
        res.redirect("/location");
    });
};

function isLoggedIn(req, res, next) {
    return secured();
}