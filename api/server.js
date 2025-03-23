const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const morgan = require("morgan");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

const authRoutes = require("../routes/AuthRoutes");
const fileRoutes = require("../routes/FileRoutes");
const productRoutes = require("../routes/ProductRoutes");
const transactionRoutes = require("../routes/TransactionRoutes");
const userRoutes = require("../routes/UserRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

app.get("/", (_, res) => {
  res.status(200).json({
    message: "OK",
  });
});

module.exports.app;
