const mongoose = require("mongoose");
const router = require("express").Router();
const Group = mongoose.model("Group");
const Account = mongoose.model("Account");
const Restaurant = mongoose.model("Restaurant");
const request = require("request");
const auth = require("../auth");
const fetch = require("node-fetch");

const CLIENT_ID = process.env.foursquareClientId;
const CLIENT_SECRET = process.env.foursquareClientSecret;
const GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY;

router.post("/restaurants/search", auth.required, async (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const { searchTerm,
      searchAddress,
      latitude,
      longitude } = req.body;
    const searchGeo = searchAddress ? null : `${latitude},${longitude}`;
    const baseUrl = "https://api.foursquare.com/v2/venues/explore?v=20170801&";
    const ll = await fetchLongLat(searchGeo, searchAddress, next)
    const searchParams = {
      ll: latLon,
      query: searchTerm,
      limit: 15,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    };
    const esc = encodeURIComponent;
    const query = Object.keys(searchParams)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
    console.log("SEARCHING", query);
    const url = baseUrl + query
    fetch((url), {
      method: "GET"
    }).then(response => response.json()).then((responseJson) => {
        console.log('RESPONSE', responseJson);
        if (!responseJson.response.groups || !responseJson.response.groups[0].items.length) {
          const err = {
            status: 400,
            errorMessage: "No restaurants found",
          }
          return next(err);
        }
        const restaurants = Restaurant.parseSearch(responseJson.response.groups[0].items);
        return res.json({ restaurants: restaurants });
      }).catch(next);
  });

  router.post("/restaurants/add", auth.required, (req, res, next) => {
    Account.findById(req.payload.id).then((account) => {
      if (!account) { return next({ status: 401 }) }

      const { groupId, restaurantData } = req.body;

      const restaurant = new Restaurant(restaurantData);
      Group.findById(groupId).then((group) => {
        if (!group) { return next({ status: 401 }) }
        restaurant.save().then(() => {
          if (restaurant) {
            console.log("Adding restaurant", restaurant);
            group.addRestaurant(restaurant.id).then(() => {
              return res.json({
                item: restaurant
              });
            }).catch(next);
          }
        }).catch(next);
      });
    });
    })
});

router.post("/restaurants/remove", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const { groupId, restaurantId } = req.body;
    Group.findById(groupId).then((group) => {

      if (!group) { return next({ status: 401 }) }
      group.removeRestaurant(restaurantId).then(() => {
        Restaurant.findByIdAndRemove(restaurantId).then(() => {
          console.log("Removing restaurant", restaurantId);
          return res.send(200);
        }).catch(next);
      });
    }).catch(next);
  });
});

router.post("/restaurants/favorite", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const { itemId, groupId } = req.body;
    Restaurant.findById(itemId).then((restaurant) => {
      restaurant.isFavorite = true;
      restaurant.save().then(() => {
        console.log("Adding favorite restaurant", restaurant);
        return res.send(200);
      });
    }).catch(next);
  });
});

const fetchLongLat = async (lonLat, searchAddress) => {
  if (lonLat) {
    return lonLat;
  } else {
    const searchTerm = searchAddress.split(" ").join("+")
    const searchUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchTerm}&key=${GOOGLE_MAP_KEY}`;
    const response = await fetch(searchUrl);
    const responseJson = await response.json();
    const calculatedLatLon = `${responseJson.results[0].geometry.location.lat},${responseJson.results[0].geometry.location.lng}`;  
    return calculatedLatLon;
  }
}

module.exports = router;
