const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const auth = require('../auth');

router.post('/accounts/create-group', auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return res.sendStatus(401); }

      let group = new Group( {
        name: req.body.groupName,
        image: req.body.groupImage,
        admin: account,
      });
      group.addMember(account._id);
      return group.save().then(()=> {
        group.addGroupInvitations(req.body.groupMember);
        account.group = group._id;
        account.save().then(()=> {
          return account.fullProfile(account, res);
        }).catch(next)
      });
    }).catch(next);
});


router.post('/accounts/group-invitations/accept/:groupId', auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return res.sendStatus(401); }
      const groupId = req.params.groupId;
      account.removeGroupInvitation(groupId);
      account.group = groupId;
      account.save().then(() => {
        Group.findById(groupId).then((group) => {
          group.addMember(account._id);
          group.save().then(() => {
            return group.fullDetail(group, res);
          }).catch(next);
        });
      }).catch(next);
    }).catch(next);
});


router.post('/accounts/group-invitations/reject/:groupId', auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return res.sendStatus(401); }
      const groupId = req.params.groupId;
      account.removeGroupInvitation(groupId);
      return account.save().then(() => {
        return account.fullProfile(res);
      }).catch(next);
    }).catch(next);
});

router.get('/groups/:groupId', auth.required,  (req, res, next) => {
  Account.findById(req.payload.id).then( (account) => {
    if (!account) { return res.sendStatus(401); }
    const groupId = req.params.groupId;
    Group.findById(groupId).then((group) => {
      return group.fullDetail(group, res)
    }).catch(next); 
  }).catch(next);
});



module.exports = router;
