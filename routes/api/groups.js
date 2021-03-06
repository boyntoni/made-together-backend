const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const auth = require("../auth");

router.post("/accounts/create-group", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return next({ status: 401 }) }

      const { groupName,
              admin,
              groupMember,
            } = req.body;

      const group = new Group( {
        name: groupName,
        admin: account,
      });

      group.addMember(account._id);

      return group.save().then(() => {
        console.log("Saving group", group);
        group.addGroupInvitations(groupMember);
        account.group = group._id;
        account.save().then(()=> {
          return account.fullProfile(account, res);
        }).catch(next)
      });
    }).catch(next);
});


router.post("/accounts/group-invitations/accept/:groupId", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return next({ status: 401 }) }
      const { groupId } = req.params;
      account.removeGroupInvitation(groupId);
      account.group = groupId;
      account.save().then(() => {
        Group.findById(groupId).then((group) => {
          group.addMember(account._id);
          group.save().then(() => {
            console.log("Account", account.username, "accepted group invitation", group);
            return group.fullDetail(group, res);
          }).catch(next);
        });
      }).catch(next);
    }).catch(next);
});


router.post("/accounts/group-invitations/reject/:groupId", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return next({ status: 401 }) }
      const { groupId } = req.params;
      console.log("Account", account.username, "rejected group invitation", groupId);
      account.removeGroupInvitation(groupId);
      return account.save().then(() => {
        return account.fullProfile(account, res);
      }).catch(next);
    }).catch(next);
});

router.get("/groups/:groupId", auth.required,  (req, res, next) => {
  Account.findById(req.payload.id).then( (account) => {
    if (!account) { return next({ status: 401 }) }
    const { groupId } = req.params;
    Group.findById(groupId).then((group) => {
      console.log("Retrieving group", group);
      return group.fullDetail(group, res)
    }).catch(next); 
  }).catch(next);
});



module.exports = router;
