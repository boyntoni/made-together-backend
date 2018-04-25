const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
    name: { type: String },
    isFavorite: { type: Boolean },
}, { timestamps: true });

module.exports = mongoose.model("Destination", DestinationSchema);
