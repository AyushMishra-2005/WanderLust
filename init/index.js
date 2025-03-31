const mongoose = require("mongoose");
const initData = require("./data.js"); // Ensure this path is correct
const Listing = require("../models/listing.js"); // Ensure this path is correct

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    console.log("Old data deleted");

    let updatedData = await Promise.all(
      initData.data.map(async (obj) => {
        return { ...obj, owner: "67cf0ccaab4a59f33ace71aa" }; 
      })
    );

    await Listing.insertMany(updatedData);
    console.log("Data initialized successfully");

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initDB();