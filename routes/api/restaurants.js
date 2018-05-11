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

router.post("/restaurants/search", auth.required, (req, res, next) => {
  Account.findById(req.payload.id).then((account) => {
    if (!account) { return next({ status: 401 }) }
    const { searchTerm,
      searchAddress,
      latitude,
      longitude } = req.body;
    const searchGeo = searchAddress ? null : `${latitude},${longitude}`;
    console.log("SEARCH GEO BEFORE", searchGeo);
    const baseUrl = "https://api.foursquare.com/v2/venues/explore?v=20170801&";
    const latLon = fetchLongLat(searchGeo, searchAddress, next)
    console.log("SEARCH GEO AFTER", latLon);
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

async function fetchLongLat(lonLat, searchAddress) {
  return new Promise((resolve, reject) => {
    console.log("in fetchhh", lonLat);
    if (lonLat) {
      console.log("OOOOOOPPPPSSSSS")
      resolve(lonLat);
    } else {
      console.log("PREPARING TO SEARCH");
      const searchTerm = searchAddress.split(" ").join("+")
      const searchUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchTerm}&key=${GOOGLE_MAP_KEY}`;
      requestGeo(searchUrl).then((geoData) => {
        if (geoData) {
          resolve(geoData);
        } else {
          reject();
        }
      }).catch(reject);
    }
  })
}

async function requestGeo() {
  return new Promise((resolve), reject) {
    const data = await fetch((url), {
      method: "GET",
    })
    if (data) {
      resolve(data);
    } else {
      reject();
    }
  }
}

module.exports = router;
