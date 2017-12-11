const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const request = require('request');
const auth = require('../auth');
const fetch = require("node-fetch");

const RestaurantParser = require('../../utils/RestaurantParser');

const CLIENT_ID = require('../../config').foursquareClientId;
const CLIENT_SECRET = require('../../config').foursquareClientSecret;

router.post('/restaurants/search', auth.required, function(req, res, next) {
  Account.findById(req.payload.id).then(function(account){
    if (!account) { return res.sendStatus(401); }
    let searchQuery = req.body.searchTerm;
    let searchGeo = `${req.body.latitude},${req.body.longitude}`;
    let baseUrl = 'https://api.foursquare.com/v2/venues/explore?v=20170801&';
    let params = {
      ll: searchGeo,
      query: searchQuery,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    };
    let esc = encodeURIComponent;
    let query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    console.log(baseUrl + query)
    let url = baseUrl + query
    fetch((url + query), {
      method: 'GET'
    }).then(response => response.json())
    .then((responseJson) => {
      console.lo
      // if (responseJson.response.groups) { return res.sendStatus(401); }
      // if (!responseJson.response.groups[0].items.length) { return res.sendStatus(401); }
      let restaurants = new RestaurantParser(responseJson.response.groups[0].items).toJson();
      return res.json({restaurants: restaurants});
    }).catch((error) => {
      console.log(error);
    });
  }).catch(next);
});

module.exports = router;
