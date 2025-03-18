const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    cloudniary_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("file", fileSchema)