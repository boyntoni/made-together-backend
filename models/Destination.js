const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
    name: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Destination", DestinationSchema);
