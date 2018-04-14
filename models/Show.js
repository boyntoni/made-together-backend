const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
    name: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Show", ShowSchema);
