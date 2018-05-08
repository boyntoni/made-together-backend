const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Restaurant = mongoose.model("Restaurant");
const request = require("request");
const auth = require("../auth");
const fetch = require("node-fetch");

const CLIENT_ID = require("../../config").foursquareClientId;
const CLIENT_SECRET = require("../../config").foursquareClientSecret;

router.post("/restaurants/search", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const { searchTerm,
      searchAddress,
      latitude,
      longitude } = req.body;
    const searchGeo = `${latitude},${longitude}`;
    const baseUrl = "https://api.foursquare.com/v2/venues/explore?v=20170801&";
    let params;
    if (searchAddress) {
      params = {
        near: searchAddress,
        query: searchTerm,
        limit: 15,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      };
    } else {
      params = {
        ll: searchGeo,
        query: searchTerm,
        limit: 15,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      };
    }
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
    const url = baseUrl + query
    fetch((url), {
      method: "GET"
    }).then(response => response.json())
      .then((responseJson) => {
        if (!responseJson.response.groups || !responseJson.response.groups[0].items.length) {
          const err = {
            status: 400,
            errorMessage: "No restaurants found",
          }
          return next(err);
        }
        const restaurants = Restaurant.parseSearch(responseJson.response.groups[0].items);
        return res.json({ restaurants: restaurants });
      });
  }).catch(next);
});

router.post("/restaurants/add", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }

    const { groupId,
      restaurantData
    } = req.body;

    const restaurant = new Restaurant(restaurantData);
    Group.findById(groupId).then((group) => {
      if (!group) { return next({ status: 401 }) }
      restaurant.save().then(() => {
        if (restaurant) {
          group.addRestaurant(restaurant.id).then(() => {
            return group.fullDetail(group, res)
          }).catch(next);
        }
      }).catch(next);
    });
  });
});

router.post("/restaurants/remove", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const groupId = req.body.groupId;
    const restaurantId = req.body.restaurantId;
    Group.findById(groupId).then((group) => {

      if (!group) { return next({ status: 401 }) }

      group.removeRestaurant(restaurantId).then(() => {
  
        Restaurant.findByIdAndRemove(restaurantId).then(() => {
          return group.fullDetail(group, res)
        }).catch(next);
      });
    }).catch(next);
  });
});

router.post("/restaurants/favorite", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const { itemId } = req.body;
    Restaurant.findById(itemId).then((restaurant) => {
      restaurant.isFavorite = true;
      restaurant.save().then(() => {
        return res.status(200);
      });
    }).catch(next);
  });
});

module.exports = router;
