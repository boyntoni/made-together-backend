const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    name: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Movie", MovieSchema);
