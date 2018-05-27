const mongoose = require("mongoose");

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
  longitude: { type: Number },
  isFavorite: { type: Boolean },
}, {timestamps: true});

RestaurantSchema.statics.parseSearch = (restaurants) => {
  console.log(restaurants);
  return restaurants.map((restaurant) => {
    const restaurantData = restaurant.venue;
    const safePrice = restaurantData.price && restaurantData.price.tier ? restaurant.price.tier : 0;
    const newRestaurantData = {
        name: restaurantData.name,
        foursquareId: restaurantData.id,
        price: safePrice,
        category: restaurantData.categories[0].shortName,
        categoryId: restaurantData.categories[0].id,
        rating: restaurantData.rating,
        formattedAddress: restaurantData.location.formattedAddress.join(" "),
        latitude: restaurantData.location.lat,
        longitude: restaurantData.location.lng
      };
      return newRestaurantData;
    });
}

module.exports = mongoose.model("Restaurant", RestaurantSchema);
