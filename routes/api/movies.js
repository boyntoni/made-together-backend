const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Movie = mongoose.model("Movie");
const auth = require("../auth");
const fetch = require("node-fetch");

router.post("/movies/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }

        const { groupId, name} = req.body;
        const movie = new Movie({ name });
        
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            movie.save().then(() => {
                if (movie) {
                    group.addMovie(movie.id).then(() => {
                        return group.fullDetail(group, res);
                    }).catch(next);
                }
            }).catch(next);
        });
    });
});

router.post("/movies/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId, itemName } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            Movie.findOneAndRemove({ "name": itemName }).then(() => {
                return group.fullDetail(group, res);
            });
        }).catch(next);
    });
});

router.post("/movies/favorite", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { itemName, groupId } = req.body;
        console.log("GROUP ID", groupId);
        Movie.findOne({ "name": itemName }).then((movie) => {
            movie.isFavorite = true;
            movie.save().then(() => {
                Group.findById(groupId).then((group, res) => {
                    return group.fullDetail(group, res);
                }).catch(next);
            });
        }).catch(next);
    });
});

module.exports = router;
