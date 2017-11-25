const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const auth = require('../auth');

router.post('/accounts/create-group', auth.required, function(req, res, next) {
    Account.findById(req.payload.id).then(function(account) {
      if (!account) { return res.sendStatus(401); }

      let group = new Group();
      group.name = req.body.groupName;
      group.image = req.body.groupImage;
      group.admin = account;
      group.addMember(account._id);
      group.groupMembers = req.body.groupMembers;
      return group.save().then(function(){
        account.addGroup(group._id);
        return res.json({group: group.toJSON()});
      });
    }).catch(next);
});

module.exports = router;
