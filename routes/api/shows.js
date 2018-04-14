const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Show = mongoose.model("Show");
const auth = require("../auth");
const fetch = require("node-fetch");

router.post("/shows/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then(function (account) {
        if (!account) { return res.sendStatus(401); }
        const groupId = req.body.groupId;
        const show = new Show({ name: req.body.name });
        Group.findById(groupId).then(function (group) {
            if (!group) { return res.sendStatus(401); }
            show.save().then(function () {
                if (show) {
                    group.addShow(show.id);
                    return group.fullDetail(group, res)
                }
            }).catch(next);
        });
    });
});

router.post("/shows/remove", auth.required, function (req, res, next) {
    Account.findById(req.payload.id).then(function (account) {
        if (!account) { return res.sendStatus(401); }
        const groupId = req.body.groupId;
        const showId = req.body.itemId;
        Group.findById(groupId).then(function (group) {
            if (!group) { return res.sendStatus(401); }
            show.findByIdAndRemove(showId).then(() => {
                return group.fullDetail(group, res);
            });
        }).catch(next);
    });
});

module.exports = router;
