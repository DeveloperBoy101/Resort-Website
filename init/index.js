const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/Listing.js"); // ✅ Corrected Path

const mongo_Url = "mongodb://127.0.0.1:27017/WanderLust";

async function main() {
  await mongoose.connect(mongo_Url);
}

main()
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Error detected!", err));

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner:'67c65108d7fea75283e74c47'}))
  await Listing.insertMany(initData.data); // ✅ Fixed Import
  console.log("Data was initialized..");
};

initDb();
