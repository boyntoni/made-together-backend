class RestaurantParser {
  constructor(restaurantData) {
    this.restaurantData = restaurantData
    this.restaurants = [];
  }

  toJson() {
    return this.restaurantData.map((restaurant) => {
      let restaurantData = restaurant.venue;
      console.log({
        categories: restaurantData.categories,
        contact: restaurantData.contact,
        hours: restaurantData.hours,
        contact: restaurantData.contact,
        id: restaurantData.id,
        name: restaurantData.name,
        location: restaurantData.location,
        price: restaurantData.price,
        rating: restaurantData.rating,
        url: restaurantData.url,
      })
      return {
        categories: restaurantData.categories,
        contact: restaurantData.contact,
        hours: restaurantData.hours,
        contact: restaurantData.contact,
        id: restaurantData.id,
        name: restaurantData.name,
        location: restaurantData.location,
        price: restaurantData.price,
        rating: restaurantData.rating,
        url: restaurantData.url,
      }
    });
  }

}

module.exports = RestaurantParser
