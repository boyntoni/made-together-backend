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
  image: {
    type: String,
    default: "https://static.productionready.io/images/smiley-cyrus.jpg"
  },
  // restaurants: [{ { type: mongoose.Schema.Types.ObjectId, ref: "Account" } }]
}, {timestamps: true});


GroupSchema.methods.fullDetail = function(group, res){
  let populateOpts = [
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
  var self = this;
  if (accountId) {
      Account.findById(accountId).then((account) => {
        if (!account) { return res.sendStatus(401); }
        account.addGroupInvitation(self.id);
      });
  }
  return;
}

GroupSchema.methods.addMember = function(id) {
  if(this.members.indexOf(id) === -1){
    this.members.push(id);
    this.save();
  }
  return;
};

GroupSchema.methods.removeMember = function(id) {
  this.members.remove(id);
  this.save();
};

GroupSchema.methods.addRestaurant = function(id) {
  if(this.restaurants.indexOf(id) === -1){
    this.restaurants.push(id);
    this.save();
  }
  return;
};

GroupSchema.methods.removeRestaurant = function(id) {
  this.restaurants.remove(id);
  this.save();
};

GroupSchema.methods.addMovie = function(id){
  if (this.movies.indexOf(id) === -1) {
    this.movies.push(id);
    this.save();
  }
  return;
};

GroupSchema.methods.removeMovie= function(id) {
  this.movies.remove(id);
  this.save();
};

GroupSchema.methods.addShow = function(id) {
  if (this.shows.indexOf(id) === -1) {
    this.shows.push(id);
    this.save();
  }
  return;
};

GroupSchema.methods.removeShow = function(id) {
  this.shows.remove(id);
  this.save();
};

GroupSchema.methods.addDestination = function(id) {
  if (this.destinations.indexOf(id) === -1) {
    this.destinations.push(id);
    this.save();
  }
  return;
};

GroupSchema.methods.removeDestination = function(id) {
  this.destinations.remove(id);
  this.save();
};


module.exports = mongoose.model("Group", GroupSchema);
