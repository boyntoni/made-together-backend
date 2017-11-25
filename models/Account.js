const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "E-mail cannot be blank"],
    index: true
  },
  username: {
    type: String,
    lowercase: true,
    required: [true, "Username cannot be blank"],
    index: true
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  groupInvitations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  image: String,
  password: {
    type: String,
    required: true,
    minlength: 3
  }
}, {timestamps: true});

AccountSchema.plugin(require('mongoose-bcrypt'));

AccountSchema.pre('save', function(next){
  if(!this.isModified('password')) {
    return next();
  }
  try {
    const hash = bcrypt.hash(this.password, 16.5);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

AccountSchema.methods.validPassword = function(attemptedPassword) {
  try {
    return bcrypt.compare(attemptedPassword, this.password);
  } catch (err) {
    throw err;
  }
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
    id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image: this.image,
    groups: this.populateGroups(),
    groupInvitations: this.populateGroupInvitations()
  };
};

AccountSchema.methods.populateGroups = function() {
  return this.populate('groups', '_id name');
}

AccountSchema.methods.populateGroupInvitations = function() {
  return this.populate('groupInvitations', '_id name');
}

AccountSchema.methods.addGroup = function(id){
  if(this.groups.indexOf(id) === -1){
    this.groups.push(id);
  }

  return this.save();
};

AccountSchema.methods.removeGroup = function(id){
  this.groups.remove(id);
  return this.save();
};

AccountSchema.methods.addGroupInvitation = function(id){
  if(this.groupInvitations.indexOf(id) === -1){
    this.groupInvitations.push(id);
  }

  return this.save();
};

AccountSchema.methods.removeGroupInvitation = function(id){
  this.groupInvitations.remove(id);
  return this.save();
};


mongoose.model('Account', AccountSchema);
