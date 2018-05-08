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
                    group.addShow(show.id);
                    // return group.fullDetail(group, res)
                    res.status(200).send();
                }
            }).catch(next);
        });
    });
});

router.post("/shows/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId,
            itemName } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            Show.findOneAndRemove({ name: itemName }).then(() => {
                // return group.fullDetail(group, res);
                res.status(200).send();
            });
        }).catch(next);
    });
});

router.post("/shows/favorite", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { itemId } = req.body;
        Show.findById(itemId).then((show) => {
            show.isFavorite = true;
            show.save().then(() => {
                return res.status(200);
            });
        }).catch(next);
    });
});

module.exports = router;
