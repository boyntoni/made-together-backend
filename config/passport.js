const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

passport.use(new LocalStrategy(
  function(username, password, done) {
    Account.findOne({ username: username }, function (err, account) {
      if (err) { return done(err); }
      if (!account) { return done(null, false); }
      if (!account.verifyPassword(password)) { return done(null, false); }
      return done(null, account);
    });
  }
));
