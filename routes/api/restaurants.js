const mongoose = require('mongoose');
const router = require('express').Router();
const Group = mongoose.model('Group');
const Account = mongoose.model('Account');
const Restaurant = mongoose.model('Restaurant');
const request = require('request');
const auth = require('../auth');
const fetch = require("node-fetch");

const RestaurantParser = require('../../utils/RestaurantParser');

const CLIENT_ID = require('../../config').foursquareClientId;
const CLIENT_SECRET = require('../../config').foursquareClientSecret;

router.post('/restaurants/search', auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return res.sendStatus(401); }
    const searchQuery = req.body.searchTerm;
    const searchGeo = `${req.body.latitude},${req.body.longitude}`;
    const baseUrl = 'https://api.foursquare.com/v2/venues/explore?v=20170801&';
    const params = {
      ll: searchGeo,
      query: searchQuery,
      limit: 15,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    const url = baseUrl + query
    fetch((url + query), {
      method: 'GET'
    }).then(response => response.json())
    .then((responseJson) => {
      // if (responseJson.response.groups) { return res.sendStatus(401); }
      // if (!responseJson.response.groups[0].items.length) { return res.sendStatus(401); }
      const restaurants = Restaurant.parseSearch(responseJson.response.groups[0].items);
      return res.json({restaurants: restaurants});
    }).catch((error) => {
      console.log(error);
    });
  }).catch(next);
});

router.post('/restaurants/search', auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return res.sendStatus(401); }
    const searchQuery = req.body.searchTerm;
    const searchGeo = `${req.body.latitude},${req.body.longitude}`;
    const baseUrl = 'https://api.foursquare.com/v2/venues/explore?v=20170801&';
    const params = {
      ll: searchGeo,
      query: searchQuery,
      limit: 15,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    const url = baseUrl + query
    fetch((url + query), {
      method: 'GET'
    }).then(response => response.json())
    .then((responseJson) => {
      // if (responseJson.response.groups) { return res.sendStatus(401); }
      // if (!responseJson.response.groups[0].items.length) { return res.sendStatus(401); }
      let restaurants = Restaurant.parseSearch(responseJson.response.groups[0].items);
      return res.json({restaurants: restaurants});
    }).catch((error) => {
      console.log(error);
    });
  }).catch(next);
});

router.post('/restaurants/add', auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return res.sendStatus(401); }
    const groupId = req.body.groupId;
    const restaurantData = req.body.restaurantData;
    const restaurant = new Restaurant(restaurantData);
    Group.findById(groupId).then((group) => {
      if (!group) { return res.sendStatus(401); }
      restaurant.save().then(() => {
        if (restaurant) {
          group.addRestaurant(restaurant.id);
          return group.fullDetail(group, res)
        }
      }).catch(next);
    });
  });
});

router.post('/restaurants/remove', auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return res.sendStatus(401); }
    const groupId = req.body.groupId;
    const restaurantId = req.body.restaurantId;
    Group.findById(groupId).then((group) => {
      if (!group) { return res.sendStatus(401); }
      Restaurant.findByIdAndRemove(restaurantId).then(() => {
        return group.fullDetail(group, res);
      });
    }).catch(next);
  });
});

module.exports = router;
