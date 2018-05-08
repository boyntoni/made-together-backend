const mongoose = require("mongoose");
const Account = require("./Account");
const Restaurant = require("./Restaurant");
const Movie = require("./Movie");
const Destination = require("./Destination");
const Show = require("./Show");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Group name cannot be blank"],
    index: true
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  shows: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
}, {timestamps: true});


GroupSchema.methods.fullDetail = function(group, res){
  console.log("ADDING TO GROUP", group)
  const populateOpts = [
      { path: "members", select: "_id username", model: "Account"},
      { path: "restaurants", model: "Restaurant"},
      { path: "movies", model: "Movie" },
      { path: "destinations", model: "Destination" },
      { path: "shows", model: "Show" }
  ]
  this.constructor.populate(this, populateOpts, (err, populatedGroup) => {
    if (err) { return next(err); }
    return res.json({ group: populatedGroup });
  });
};

GroupSchema.methods.addGroupInvitations = function(accountId) {
  const self = this;
  if (accountId) {
      Account.findById(accountId).then((account) => {
        if (!account) { return res.sendStatus(401); }
        return account.addGroupInvitation(self.id);
      }).catch(() => {
        reject();
      });
  }
  return;
}

GroupSchema.methods.addMember = function(id) {
  return new Promise((resolve, reject) => {
    if (this.members.indexOf(id) === -1) {
      this.members.push(id)
      this.save().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
};

GroupSchema.methods.removeMember = function(id) {
  this.members.remove(id);
  this.save();
};

GroupSchema.methods.addRestaurant = function(id) {
  return new Promise((resolve, reject) => {
    if (this.restaurants.indexOf(id) === -1) {
      this.restaurants.push(id);
      this.save().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
};

GroupSchema.methods.removeRestaurant = function(id) {
  return new Promise((resolve, reject) => {
    this.restaurants.remove(id);
    this.save().then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
  })
};

GroupSchema.methods.addMovie = function(id){
  return new Promise((resolve, reject) => {
    if (this.movies.indexOf(id) === -1) {
      this.movies.push(id);
      this.save().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
};

GroupSchema.methods.removeMovie= function(id) {
  return new Promise((resolve, reject) => {
    this.movies.remove(id)
    this.save().then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
  });
};

GroupSchema.methods.addShow = function(id) {
  return new Promise((resolve, reject) => {
    if (this.shows.indexOf(id) === -1) {
      this.shows.push(id);
      this.save().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
};

GroupSchema.methods.removeShow = function(id) {
  return new Promise((resolve, reject) => {
    this.shows.remove(id);
    return this.save().then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
  });
};

GroupSchema.methods.addDestination = function(id) {
  return new Promise((resolve, reject) => {
    if (this.destinations.indexOf(id) === -1) {
      this.destinations.push(id);
      return this.save().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
};

GroupSchema.methods.removeDestination = function(id) {
  return new Promise((resolve, reject) => {
    this.destinations.remove(id);
    this.save().then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
  });
};


module.exports = mongoose.model("Group", GroupSchema);
