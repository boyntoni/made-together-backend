const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const AccountSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  image: String,
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  password: String
}, {timestamps: true});

AccountSchema.plugin(uniqueValidator, {message: 'is already taken.'});
AccountSchema.plugin(require('mongoose-bcrypt'));

AccountSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.hash(user.password, null, null, function(err, hash){
      if (err){
        next();
      }
      user.password = hash;
      next();
    });
  }
  next();
});

AccountSchema.methods.validPassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

AccountSchema.methods.generateJWT = function() {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

AccountSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    token: this.generateJWT(),
    image: this.image
  };
};

AccountSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};

AccountSchema.methods.addRestaurant = function(id){
  if(this.restaurants.indexOf(id) === -1){
    this.restaurants.push(id);
  }

  return this.save();
};

AccountSchema.methods.removeRestaurant = function(id){
  this.restaurants.remove(id);
  return this.save();
};

AccountSchema.methods.hasBeenAdded = function(object, id){
  switch (object) {
    case 'restaurant':
      return this.restaurants.some(function(restaurantId){
        return restaurantId.toString() === id.toString();
      });
    default:
      return true;
  }
};


mongoose.model('Account', AccountSchema);
