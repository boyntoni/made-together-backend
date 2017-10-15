const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
});

const Account = mongoose.model('Account', accountSchema);
module.exports = {
  Account
}
