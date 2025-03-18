const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")

dotenv.config

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.listen(3000, () => {
    console.log(`App running on http://localhost:3000`)
})

app.get("/api", (_, res) => {
    res.status(200).json({
        message: "OK"
    })
})

module.exports.app