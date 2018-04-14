const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Movie = mongoose.model("Movie");
const auth = require("../auth");
const fetch = require("node-fetch");

router.post("/movies/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return res.sendStatus(401); }
        const groupId = req.body.groupId;
        const movie = new Movie({ name: req.body.name });
        Group.findById(groupId).then((group) => {
            if (!group) { return res.sendStatus(401); }
            movie.save().then(() => {
                if (movie) {
                    group.addMovie(movie.id);
                    return group.fullDetail(group, res)
                }
            }).catch(next);
        });
    });
});

router.post("/movies/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return res.sendStatus(401); }
        const groupId = req.body.groupId;
        const movieId = req.body.itemId;
        Group.findById(groupId).then((group) => {
            if (!group) { return res.sendStatus(401); }
            Movie.findByIdAndRemove(movieId).then(() => {
                return group.fullDetail(group, res);
            });
        }).catch(next);
    });
});

module.exports = router;
