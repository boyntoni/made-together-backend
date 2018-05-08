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
            name } = req.body;

        const destination = new Destination({ name });

        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            destination.save().then(() => {
                if (destination) {
                    group.addDestination(destination.id).then(() => {
                        return group.fullDetail(group, res);
                    }).catch(next);
                }
            }).catch(next);
        });
    });
});

router.post("/destinations/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId,
            itemName } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            Destination.findOneAndRemove({ name: itemName }).then(() => {
                return group.fullDetail(group, res);
            });
        }).catch(next);
    });
});

router.post("/destinations/favorite", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { itemId } = req.body;
        Destination.findById(itemId).then((destination) => {
            destination.isFavorite = true;
            destination.save().then(() => {
                return res.status(200);
            });
        }).catch(next);
    });
});

module.exports = router;
