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
      group.addGroupInvitations(req.body.groupMembers);
      return group.save().then(function(){
        account.addGroup(group._id);
        account.save().then(function(){
          return account.fullProfile(res);
        }).catch(next)
      });
    }).catch(next);
});


router.post('/accounts/group-invitations/accept/:groupId', auth.required, function(req, res, next) {
    Account.findById(req.payload.id).then(function(account) {
      if (!account) { return res.sendStatus(401); }
      account.removeGroupInvitation(groupId);
      account.addGroup(groupId);
      account.save().then(function() {
        Group.findById(groupId).then(function(group) {
          group.addMember(account._id);
          group.save().then(function() {
            return account.fullProfile(res);
          }).catch(next);
        });
      }).catch(next);
    }).catch(next);
});


router.post('/accounts/group-invitations/reject/:groupId', auth.required, function(req, res, next) {
    Account.findById(req.payload.id).then(function(account) {
      if (!account) { return res.sendStatus(401); }
      account.removeGroupInvitation(groupId);
      return account.save().then(function() {
        return account.fullProfile(res);
      }).catch(next);
    }).catch(next);
});


module.exports = router;
