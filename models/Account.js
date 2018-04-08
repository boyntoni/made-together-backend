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
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
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

AccountSchema.methods.fullProfile = function(account, res) {
  let populateOpts = [
    { path: 'group' , model: 'Group'},
    { path: 'groupInvitations', select: '_id name', model: 'Group',
      populate: { path: 'admin', select: 'username', model: 'Account'}}
  ]
  this.constructor.populate(this, populateOpts, function(err, populatedAccount) {
    if (err) { return next(err); }
    let token = account.generateJWT();
    return res.json({account: populatedAccount, token: token});
  });
};

AccountSchema.methods.removeGroup = function(){
  return this.group = null;
};

AccountSchema.methods.addGroupInvitation = function(id){
  if(this.groupInvitations.indexOf(id) === -1){
    this.groupInvitations.push(id);
  }
  return this.save();
};

AccountSchema.methods.removeGroupInvitation = function(id){
  return this.groupInvitations.remove(id);
};


module.exports = mongoose.model('Account', AccountSchema);
