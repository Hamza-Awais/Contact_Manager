const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contacts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    const firstError = Object.values(err.errors)[0];
    return res.status(400).json({ message: firstError.message });
  }
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Add it to backend/.env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
