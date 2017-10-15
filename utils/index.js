const { ExtractJwt } = require('passport-jwt'), JwtStrategy = require('passport-jwt').Strategy;
const { Account } = require('../db/schema');

const findAccount = (query, callback) => {
    process.nextTick(() =>
        Account.findOne(query).exec((err, account) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (account) return callback(null, account);
            return callback(null, null);
        })
    );
}

const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromBodyField('token'),
    secret: 'asdfmasdklgmasdamalkfmadas'
}

const jwtAuth = new JwtStrategy(jwtConfig, function(payload, done) {
    let { id } = payload;
    Account.findById(id, function(err, account) {
        if (err) return done(err);
        if (!account) return done(null, false);
        return done(null, account);
    });
});

module.exports = {
    findAccount,
    jwtAuth,
    jwtConfig
};
