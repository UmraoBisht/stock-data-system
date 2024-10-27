import dotenv from "dotenv";
// Load environment variables from.env file
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";

// Connect to MongoDB
const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI ,{
        dbName:"stock_data"
    });
    console.log("MongoDB connected ::" + connectionInstance.connection.host);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export default connectToDB;
