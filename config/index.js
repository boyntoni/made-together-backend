module.exports = {
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "secret",
  foursquareClientId: process.env.NODE_ENV === "production" ? process.env.foursquareClientId : "ZXKRNPVQX5DWUQZEHOH0SKN03KMVKMY232JSZZMMBSYZTYTO",
  foursquareClientSecret: process.env.NODE_ENV === "production" ? process.env.foursquareClientSecret : "3JVIWVDVPUUL0P4JYK1K5UB0RQRUSA1O5RZ11VZMU4UAHMTG",
};
