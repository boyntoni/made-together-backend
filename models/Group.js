const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username cannot be blank"],
    index: true
  },
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  image: {
    type: String,
    default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
  }
}, {timestamps: true});


GroupSchema.methods.toAuthJSON = function(){
  return {
    name: this.name,
    restaurants: this.restaurants,
    image: this.image
  };
};

GroupSchema.methods.addRestaurant = function(id){
  if(this.restaurants.indexOf(id) === -1){
    this.restaurants.push(id);
  }

  return this.save();
};

GroupSchema.methods.removeRestaurant = function(id){
  this.restaurants.remove(id);
  return this.save();
};

GroupSchema.methods.hasBeenAdded = function(object, id){
  switch (object) {
    case 'restaurant':
      return this.restaurants.some(function(restaurantId){
        return restaurantId.toString() === id.toString();
      });
    default:
      return true;
  }
};


mongoose.model('Group', GroupSchema);
