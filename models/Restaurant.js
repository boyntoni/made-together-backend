const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String },
  foursquareId: { type: String },
  price: { type: Number },
  category: { type: String },
  categoryId: { type: String },
  rating: { type: Number },
  formattedAddress : { type: String },
  address: { type: String },
  contactNumber: { type: String },
  formattedContact: { type: String },
  hours: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
}, {timestamps: true});

RestaurantSchema.statics.parseSearch = function(restaurantData) {
  return restaurantData.map((restaurant) => {
    let restaurantData = restaurant.venue;
    let newRestaurantData = {
        name: restaurantData.name,
        foursquareId: restaurantData.id,
        price: restaurantData.price.tier,
        category: restaurantData.categories[0].shortName,
        categoryId: restaurantData.categories[0].id,
        rating: restaurantData.rating,
        formattedAddress: restaurantData.location.formattedAddress.join(' '),
        hours: restaurantData.hours.status,
        latitude: restaurantData.location.latitude,
        longitude: restaurantData.location.longitude
      };
      return newRestaurantData;
    });
}

module.exports = mongoose.model('Restaurant', RestaurantSchema);
