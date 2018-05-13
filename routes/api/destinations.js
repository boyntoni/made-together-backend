const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Destination = mongoose.model("Destination");
const auth = require("../auth");
const fetch = require("node-fetch");
const io = require("../../server").io;

router.post("/destinations/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }

        const { groupId, name } = req.body;

        const destination = new Destination({ name });

        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            destination.save().then(() => {
                if (destination) {
                    console.log("Saving destination", destination);
                    group.addDestination(destination.id).then(() => {
                        return res.json({
                            item: destination,
                        });
                    }).catch(next);
                }
            }).catch(next);
        });
    });
});

router.post("/destinations/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId, itemName } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            consoel.log("Deleting destination", itemName);
            Destination.findOneAndRemove({ "name": itemName }).then(() => {
                return res.send(200);
            });
        }).catch(next);
    });
});

router.post("/destinations/favorite", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { itemName } = req.body;
        Destination.findOne({ "name": itemName }).then((destination) => {
            destination.isFavorite = true;
            destination.save().then(() => {
                console.log("Adding favorite destination", destination)
                return res.send(200);
            });
        }).catch(next);
    });
});

module.exports = router;
