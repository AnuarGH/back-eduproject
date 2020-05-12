const asyncHandler = require('express-async-handler');
const JWT = require('jsonwebtoken');
const router = require('express').Router();
const {randomBytes} = require('crypto');
const base64url = require('base64url');
const config = require('../../config');
const {USER} = require('../utils/passport');

const {sendVerificationEmail} = require('../utils/mailer');
const errors = require('../utils/errors');
const {comparePasswords} = require('../utils/encryption');

const User = require('../models/User');
const TempUser = require('../models/TempUser');

function signJWT(sub){
    const exp = Date.now() + config.get('jwt:tokenLifetimeInHours') * 3600000;
    const token = JWT.sign({ sub, exp }, config.get('jwt:secret'));
    return {token, exp}
}

router.post('/', USER, asyncHandler(async (req, res) => {
    res.status(200).send(req.user.username);
}));

router.post('/login', asyncHandler(async (req, res, next) => {
    if (!req.body || (!req.body.username && !req.body.email) || !req.body.password) {
        return next(errors.badRequest);
    }
    const {username, password, email, adminPermission} = req.body;
    const query = (username) ? {username} : {email};
    const foundUser = await User.findOne(query);
    if (foundUser && comparePasswords(password, foundUser.password) && (!adminPermission || foundUser.admin === true)) {
        const {token, exp} = signJWT(foundUser.id);
        const admin = !!adminPermission;
        const data = {username, email, admin, exp};
        res.status(200).cookie("token", token, {httpOnly: true, maxAge: config.get('jwt:tokenLifetimeInHours') * 3600000}).json(data);
    } else {
        return next(errors.unauthorized);
    }
}));

router.get('/verify/:token', asyncHandler(async (req, res, next) => {
    const {token} = req.params;
    const foundUser = await TempUser.findOne({token});
    if (!foundUser || foundUser.tokenDeadline < Date.now()) return res.redirect('/expiredToken');
    const {username, name, email, password} = foundUser;
    const newUser = User({username, name, email, password});
    const userSaved = await newUser.save();
    if (!userSaved) return next(errors.serviceNotAvailable);
    await foundUser.remove();
    res.redirect('/?verified');
}));

router.post('/register', asyncHandler(async (req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password || !req.body.username) {
        return next(errors.badRequest);
    }
    const {username, email, name, password} = req.body;

    let foundUser = await User.findOne({email});
    if (foundUser) return next(errors.emailExists);
    foundUser = await User.findOne({username});
    if (foundUser) return next(errors.usernameExists);
    foundUser = await TempUser.findOne({username});
    if (foundUser) return next(errors.usernameExists);

    const token = base64url(randomBytes(config.get('emailVerification:tokenLength')));
    const tokenDeadline = Date.now() + config.get('emailVerification:tokenLifetimeInHours')*3600000;
    const emailError = await sendVerificationEmail(email, token);
    if (emailError) return next(emailError);
    let newTempUser;
    const foundTempUser = await TempUser.findOne({email});
    if (foundTempUser) {
        foundTempUser.password = password;
        foundTempUser.token = token;
        foundTempUser.tokenDeadline = tokenDeadline;
        foundTempUser.name = name;
        foundTempUser.username = username;
        newTempUser = foundTempUser;
    } else {
        newTempUser = new TempUser({username, name, email, password, token, tokenDeadline});
    }
    const result = await newTempUser.save();
    console.log(result);
    res.status(200).json({email});
}));

router.get('/logout', asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200);
}));

module.exports = router;