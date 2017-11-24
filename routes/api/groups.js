const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const auth = require('../auth');

router.post('/accounts/create-group', auth.required, function(req, res, next) {
    Account.findById(req.payload.id).then(function(account) {
      if (!account) { return res.sendStatus(401); }

      let group = new Group(req.body.group);
      group.admin = account
      account.addGroup(group._id);
      return group.save().then(function(){
        console.log(group.admin);
        return res.json({group: group.toJSONFor(group)});
      });
    }).catch(next);
});

module.exports = router;
