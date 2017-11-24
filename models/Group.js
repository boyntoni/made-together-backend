const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username cannot be blank"],
    index: true
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  image: {
    type: String,
    default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
  }
}, {timestamps: true});


GroupSchema.methods.toJSONFor = function(account){
  return {
    id: this._id,
    name: this.name,
    image: this.image,
    restaurants: this.restaurants,
    createdAt: this.createdAt
  };
};


mongoose.model('Group', GroupSchema);
