const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const xss = require("xss-clean");
const connectDB = require("./config/db");

const authRoutes = require("./routes/AuthRoutes");
const fileRoutes = require("./routes/FileRoutes");
const productRoutes = require("./routes/ProductRoutes");
const transactionRoutes = require("./routes/TransactionRoutes");
const userRoutes = require("./routes/UserRoutes");

dotenv.config();

const app = express();
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "vercel.app", "vercel.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "vercel.app", "vercel.com"],
      connectSrc: ["'self'"],
    },
  }),
);

app.use(
  helmet.crossOriginOpenerPolicy({
    policy: "same-origin",
  }),
);

const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

app.use(xss());

app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("tiny"));
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.get("/api", (_, res) => {
  res.status(200).json({
    message: "OK",
    status: "healthy",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

if (process.env.NODE_ENV !== "vercel") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on ${process.env.NODE_ENV} port ${port}`);
  });
}

module.exports = app;
