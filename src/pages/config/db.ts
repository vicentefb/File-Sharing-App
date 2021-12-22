/* eslint-disable no-console */
import mongoose from "mongoose";


// connection function
export const connectDB = async () => {
    const conn = await mongoose
      .connect(process.env.MONGO_URL as string)
      .catch(err => console.log(err))
    console.log("Mongoose Connection Established")
    
    const connection = mongoose.connection;
    if(connection.readyState >= 1){
        console.log("Connected to database.");
        return conn;
    }
  }