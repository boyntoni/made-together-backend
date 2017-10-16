const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const { jwtConfig, findAccount } = require('./index');

const { Account } = require('../schema');

router.use(passport.initialize());
router.use(passport.session());

passport.use(new Strategy({ username: 'username', password: 'password'}, (email, password, callback) => {
    findAccount({ username }, function(err, account) {
        if (err) return callback(err);
        if (!account) return callback(null, false);
        if (account && !((account.password && bcrypt.compareSync(password, account.password)) || password === account.password)) return callback(null, false);
        return callback(null, account);
    });
}));

router.post('/login',
    (req, res) => {
        passport.authenticate('local', (err, account, info) => {
            if (err) return res.json({ success: false, message: 'Error logging in.' });
            if (!account) return res.json({ success: false, message: 'Invalid credentials.' });
            let token = jwt.sign({ id: account.id }, jwtConfig.secretOrKey);
            return res.json({ accountData: account, token, success: true, message: 'Successfully logged in.' });
        })(req, res)
});

router.get('/logout', function(req, res){
    req.logout();
    res.sendStatus(200);
});

module.exports = router;
