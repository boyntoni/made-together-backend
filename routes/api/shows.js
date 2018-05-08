const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Show = mongoose.model("Show");
const auth = require("../auth");
const fetch = require("node-fetch");

router.post("/shows/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }

        const { groupId,
            name } = req.body;

        const show = new Show({ name });

        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            show.save().then(() => {
                if (show) {
                    group.addShow(show.id).then(() => {
                        return group.fullDetail(group, res)
                    }).catch(next);
                }
            }).catch(next);
        });
    });
});

router.post("/shows/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId, itemName } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            Show.findOneAndRemove({ name: itemName }).then(() => {
                return group.fullDetail(group, res)
            });
        }).catch(next);
    });
});

router.post("/shows/favorite", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { itemName, groupId } = req.body;
        Show.findOne({ name: itemName}).then((show) => {
            show.isFavorite = true;
            show.save().then(() => {
                Group.findById(groupId).then((group, res) => {
                    return group.fullDetail(group, res);
                }).catch(next);
            });
        }).catch(next);
    });
});

module.exports = router;
