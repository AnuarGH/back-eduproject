const errors = require("./errors");
const config = require('../../config');
const User = require('../models/User');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


let cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies)
    {
        token = req.cookies['token'];
    }
    return token;
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
opts.secretOrKey = config.get('jwt:secret');



passport.use('api', new JwtStrategy(opts, async (payload, done) => {
    try {
        const foundUser = await User.findOne({_id: payload.sub});
        if (foundUser) {
            return done(null, foundUser);
        } else {
            return done(null, false);
        }
    } catch(error) {
        done(error, false)
    }
}));


const adminAuth = (req, res, next) => {
    if (req.user.admin === true){
        return next();
    }
    next(errors.unauthorized);
};

const USER = [ passport.authenticate('jwt', {session: false}, null) ];
const ADMIN = [ passport.authenticate('jwt', {session: false}, null), adminAuth ];

module.exports = {USER, ADMIN};
