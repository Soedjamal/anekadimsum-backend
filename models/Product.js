const mongoose = require("mongoose")

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    cloudniary_id: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("products", productsSchema)