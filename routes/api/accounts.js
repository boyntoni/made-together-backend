const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const Account = mongoose.model("Account");
const auth = require("../auth");

router.post("/accounts/login", (req, res, next)  => {
    if(!req.body.username) {
      const err = {
        errorMessage: "Username must not be blank",
        status: 400,
      };
      return next(err);
    }

    if(!req.body.password) {
      const err = {
        errorMessage: "Password must not be blank",
        status: 400,
      };
      return next(err);
    }

    passport.authenticate("local", {session: true}, (err, account, info) => {
      if (err) { return next(err); }
      if (account) {
        return account.fullProfile(account, res);
      } else {
        const err = {
          errorMessage: "Unable to find account. Try again.",
          status: 400,
        };
        return next(err);
      }
    })(req, res, next);
});

router.post("/accounts", (req, res, next) => {
  const { username,
          password,
        } = req.body;

  const account = new Account({
    username,
    password
  });

  account.save().then(() => {
    if (account) {
      return account.fullProfile(account, res)
    } else {
      const err = {
        errorMessage: "Username already taken",
        status: 400,
      };
      return next(err);
    }
  }).catch(next);
});

router.get("/accounts/:username/search", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return res.sendStatus(401); }
    const { username } = req.params;
    Account.findOne( { "username": username }, "username", (err, searchAccount)  => {
      if (err) return next(err);
      if (!searchAccount) { 
        const err = {
          errorMessage: "Cannot locate account",
          status: 400,
        };
        return next(err);
      }
      return res.json({
        username: searchAccount.username,
        id: searchAccount.id,
      });
    });
  });
});

module.exports = router;
