const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const Account = mongoose.model("Account");
const auth = require("../auth");

router.post("/accounts/login", (req, res, next)  => {
    if(!req.body.username){
      return res.status(422).json({errors: {username: "Username cannot be blank"}});
    }

    if(!req.body.password){
      return res.status(422).json({errors: {password: "Password cannot be blank"}});
    }

    passport.authenticate("local", {session: false}, (err, account, info) => {
      if (err) { return next(err); }
      let accountGroups;
      let accountGroupInvitations;
      if (account){
        return account.fullProfile(account, res)
      } else {
        return res.status(422).json(info);
      }
    })(req, res, next);
});

router.post("/accounts", (req, res, next) => {
  let account = new Account();

  account.username = req.body.username;
  account.password = req.body.password;
  account.email = req.body.email;

  account.save().then(() => {
    if (account) {
      return account.fullProfile(account, res)
    } else {
      return res.status(400)
    }
  }).catch(next);
});

router.get("/account", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if(!account){ return res.sendStatus(401); }

    return res.json({account: account.toAuthJSON()});
  }).catch(next);
});

router.put("/account", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if(!account){ return res.sendStatus(401); }
    // only update fields that were actually passed...
    if(typeof req.body.account.username !== "undefined"){
      account.username = req.body.account.username;
    }
    if(typeof req.body.account.image !== "undefined"){
      account.image = req.body.account.image;
    }
    if(typeof req.body.account.password !== "undefined"){
      // account.setPassword(req.body.account.password);
    }

    return account.save().then(() => {
      return res.json({account: account.toAuthJSON()});
    });
  }).catch(next);
});

router.get("/accounts/:email/search", auth.required, (req, res,next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return res.sendStatus(401); }
    let accountEmail = req.params.email;
    Account.findOne( { "email": accountEmail }, "username", (err, searchAccount)  => {
      if (err) return handlerError(err);
      if (!searchAccount) { return res.sendStatus(401); }
      return res.json({username: searchAccount.username, id: searchAccount.id});
    });
  });
});

module.exports = router;
