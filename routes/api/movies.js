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
                    console.log("Adding movie", movie);
                    group.addMovie(movie.id).then(() => {
                        return res.json({
                            item: movie,
                        });
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
            Movie.findOne({ "name": itemName }).then((movie) => {
                group.removeMovie(movie).then(() => {
                    console.log("Removed movie", itemName);
                    return res.send(200);
                });
            });
        }).catch(next);
    });
});

router.post("/movies/favorite", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { itemName, groupId } = req.body;
        Movie.findOne({ "name": itemName }).then((movie) => {
            movie.isFavorite = true;
            movie.save().then(() => {
                console.log("Adding favorite movie", movie);
                return res.send(200);
            });
        }).catch(next);
    });
});

module.exports = router;
