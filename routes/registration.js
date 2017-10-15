const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { ExtractJwt } = require('passport-jwt'),
      JwtStrategy = require('passport-jwt').Strategy;
const { jwtConfig, findAccount } = require('./index');

const { Account } = require('../schema/account');

router.use(passport.initialize());
router.use(passport.session());

passport.use(new Strategy({ username: 'username', password: 'password'}, (email, password, cb) => {
    findAccount({ username }, function(err, account) {
        if (err) return cb(err);
        if (!account) return cb(null, false);
        if (account && !((account.password && bcrypt.compareSync(password, account.password)) || password == account.password)) return cb(null, false);
        return cb(null, account);
    });
}));

router.get('/hi'), (req, res, next) => {
    return res.send("hi")
};

router.post('/create-account', (req, res, next) => {
    let account = new Account(req.body);
    account.save(function(err, accountData) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message || 'Unable to save account'
            });
        }
        let token = jwt.sign({ email: accountData.email }, jwtConfig.secret);
        return res.json({ success: true, accountData, token });
    });
})

module.exports = router
