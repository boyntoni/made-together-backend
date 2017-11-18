var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

passport.use(new LocalStrategy({
  username: 'account[username]',
  password: 'account[password]'
}, function(username, password, done) {
  Account.findOne({username: username}).then(function(account){
    if(!account || !account.validPassword(password)){
      return done(null, false, {errors: {'username or password': 'is invalid'}});
    }

    return done(null, account);
  }).catch(done);
}));
