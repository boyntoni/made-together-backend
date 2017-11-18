var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Account = mongoose.model('Account');
var auth = require('../auth');

router.get('/account', auth.required, function(req, res, next){
  Account.findById(req.payload.id).then(function(account){
    if(!account){ return res.sendStatus(401); }

    return res.json({account: account.toAuthJSON()});
  }).catch(next);
});

router.put('/account', auth.required, function(req, res, next){
  Account.findById(req.payload.id).then(function(account){
    if(!account){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.account.username !== 'undefined'){
      account.username = req.body.account.username;
    }
    if(typeof req.body.account.image !== 'undefined'){
      account.image = req.body.account.image;
    }
    if(typeof req.body.account.password !== 'undefined'){
      account.setPassword(req.body.account.password);
    }

    return account.save().then(function(){
      return res.json({account: account.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/accounts/login', function(req, res, next){
  if(!req.body.account.username){
    return res.status(422).json({errors: {username: "Username cannot be blank"}});
  }

  if(!req.body.account.password){
    return res.status(422).json({errors: {password: "Password cannott be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, account, info){
    if(err){ return next(err); }

    if(account){
      account.token = account.generateJWT();
      return res.json({account: account.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/accounts', function(req, res, next){
  var account = new Account();

  account.username = req.body.username;
  account.setPassword(req.body.password);

  account.save().then(function(){
    return res.json({account: account.toAuthJSON()});
  }).catch(next);
});

module.exports = router;
