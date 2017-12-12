const mongoose = require('mongoose');
const Account = require('./Account');
const Restaurant = require('./Restaurant');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Group name cannot be blank"],
    index: true
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  image: {
    type: String,
    default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
  },
  // restaurants: [{ { type: mongoose.Schema.Types.ObjectId, ref: 'Account' } }]
}, {timestamps: true});


GroupSchema.methods.fullDetail = function (group, res) {
  let populateOpts = [
      { path: 'restaurants', model: 'Restaurant'}
  ]
  this.constructor.populate(this, populateOpts, function (err, populatedGroup) {
    if (err) { return next(err); }
    return res.json({ group: populatedGroup });
  });
};

GroupSchema.methods.addGroupInvitations = function(groupMembers){
  var self = this;
  if (groupMembers && groupMembers.length) {
    groupMembers.forEach((addedAccount) => {
      Account.findById(addedAccount.id).then(function(account) {
        if (!account) { return res.sendStatus(401); }
        account.addGroupInvitation(self.id);
      });
    });
  }
  return;
}

GroupSchema.methods.addMember = function(id){
  if(this.members.indexOf(id) === -1){
    return this.members.push(id);
  }
  return;
};

GroupSchema.methods.removeMember = function(id){
  return this.members.remove(id);
};

GroupSchema.methods.addRestaurant = function(id){
  if(this.restaurants.indexOf(id) === -1){
    return this.restaurants.push(id);
  }
  return;
};

GroupSchema.methods.removeRestaurant = function(id){
  return this.restaurants.remove(id);
};


module.exports = mongoose.model('Group', GroupSchema);
