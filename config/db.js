const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)

        mongoose.connection.once("open", () => {
            console.log("Database connected") // Pastikan ini muncul
        })

        mongoose.connection.on("error", (err) => {
            console.error("Database connection error:", err)
        })

    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB
