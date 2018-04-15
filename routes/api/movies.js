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

        const { groupId, 
                name} = req.body;
        
        console.log("adding " + name);
        const movie = new Movie({ name });
        
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            movie.save().then(() => {
                if (movie) {
                    group.addMovie(movie.id);
                    // return group.fullDetail(group, res)
                    res.status(200).send();
                }
            }).catch(next);
        });
    });
});

router.post("/movies/remove", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
        if (!account) { return next({ status: 401 }) }
        const { groupId, 
                itemId } = req.body;
        Group.findById(groupId).then((group) => {
            if (!group) { return next({ status: 401 }) }
            Movie.findByIdAndRemove(itemId).then(() => {
                // return group.fullDetail(group, res);
                res.status(200).send();
            });
        }).catch(next);
    });
});

module.exports = router;
