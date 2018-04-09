const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const Destination = mongoose.model('Destination');
const auth = require('../auth');
const fetch = require("node-fetch");

router.post('/destinations/add', auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return res.sendStatus(401); }
        const groupId = req.body.groupId;
        const destination = new Destination({ name: req.body.name });
        Group.findById(groupId).then((group) => {
            if (!group) { return res.sendStatus(401); }
            destination.save().then(() => {
                if (destination) {
                    group.addDestination(destination.id);
                    return group.fullDetail(group, res)
                }
            }).catch(next);
        });
    });
});

router.post('/destinations/remove', auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return res.sendStatus(401); }
        const groupId = req.body.groupId;
        const destinationId = req.body.itemId;
        Group.findById(groupId).then((group) => {
            if (!group) { return res.sendStatus(401); }
            destination.findByIdAndRemove(destinationId).then(() => {
                return group.fullDetail(group, res);
            });
        }).catch(next);
    });
});

module.exports = router;
