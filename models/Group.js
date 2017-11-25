const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username cannot be blank"],
    index: true
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    image: {
    type: String,
    default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
  }
}, {timestamps: true});


GroupSchema.methods.toJSON = () => {
  return {
    id: this._id,
    name: this.name,
    image: this.image,
    restaurants: this.restaurants,
    createdAt: this.createdAt
  };
};

GroupSchema.methods.addMember = function(id){
  if(this.members.indexOf(id) === -1){
    this.members.push(id);
  }

  return this.save();
};


mongoose.model('Group', GroupSchema);
