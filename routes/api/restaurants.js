const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const request = require('request');
const auth = require('../auth');
const fetch = require("node-fetch");

const CLIENT_ID = require('../../config').foursquareClientId;
const CLIENT_SECRET = require('../../config').foursquareClientSecret;

router.post('/restaurants/search', auth.required, function(req, res, next) {
  Account.findById(req.payload.id).then(function(account){
    if (!account) { return res.sendStatus(401); }
    let query = req.body.searchTerm;
    let searchGeo = `${req.body.latitude},${req.body.longitude}`;
    let url = 'https://api.foursquare.com/v2/venues/explore';
    fetch(url, {
      method: 'GET',
      qs: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        near: searchGeo,
        query: query,
        v: '20170801',
        limit: 10
      }
    }).then(response => response.json())
    .then((responseJson) => {
      return res.json({restaurants: responseJson});
    }).catch((error) => {
      console.log(error);
    });
  }).catch(next);
});

module.exports = router;
