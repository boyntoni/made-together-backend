const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Destination = mongoose.model("Destination");
const auth = require("../auth");
const fetch = require("node-fetch");

router.post("/destinations/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId,
                name }  = req.body;
        const destination = new Destination({ name });
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            destination.save().then(() => {
                if (destination) {
                    group.addDestination(destination.id);
                    return group.fullDetail(group, res)
                }
            }).catch(next);
        });
    });
});

router.post("/destinations/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId,
                itemId } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            destination.findByIdAndRemove(itemId).then(() => {
                return group.fullDetail(group, res);
            });
        }).catch(next);
    });
});

module.exports = router;
