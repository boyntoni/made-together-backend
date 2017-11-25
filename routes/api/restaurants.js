const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const request = require('request');
const auth = require('../auth');

const CLIENT_ID = require('../../config').foursquareClientId;
const CLIENT_SECRET = require('../../config').foursquareClientSecret;

router.get('/restaurants/:search', function(req, res, next) {
    // Account.findById(req.payload.id).then(function(account) {
      // if (!account) { return res.sendStatus(401); }
      let query = req.params.search;
      request({
        url: 'https://api.foursquare.com/v2/venues/explore',
        method: 'GET',
        qs: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          near: '40.7243,-74.0018',
          query: 'coffee',
          v: '20170801',
          limit: 1
        }
      }, function(err, res, body) {
        if (err) {
          console.error(err);
        } else {
          console.log(body);
        }
      });
    // }).catch(next);
});

module.exports = router;

// auth.required
