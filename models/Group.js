const mongoose = require('mongoose');
const Account = require('./Account');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Group name cannot be blank"],
    index: true
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  image: {
    type: String,
    default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
  },
  // restaurants: [{ { type: mongoose.Schema.Types.ObjectId, ref: 'Account' } }]
}, {timestamps: true});


GroupSchema.methods.toJSON = function(){
  return {
    id: this._id,
    name: this.name,
    image: this.image,
    restaurants: this.restaurants,
    createdAt: this.createdAt
  };
};

GroupSchema.pre('save', function(next){
  const self = this;
  if (this.groupMembers && this.groupMembers.length) {
    this.groupMembers.forEach((addedAccount) => {
      Account.findById(addedAccount.id).then(function(account) {
        if (!account) { return res.sendStatus(401); }
        account.addGroupInvitation(self.id);
      });
    });
  }
  next()
});


GroupSchema.methods.addMember = function(id){
  if(this.members.indexOf(id) === -1){
    this.members.push(id);
  }

  return this.save();
};


module.exports = mongoose.model('Group', GroupSchema);
