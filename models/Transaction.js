const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    transaction_id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    midtrans_url: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("transactions", transactionSchema)