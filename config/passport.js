const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

passport.use(new LocalStrategy(
  function(username, password, done) {
  Account.findOne({username: username}).then(function(account){
    if(!account || !account.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }

    return done(null, account);
  }).catch(done);
}));
