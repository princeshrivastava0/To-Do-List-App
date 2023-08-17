require("dotenv").config(); 
const mongoose = require("mongoose"); 
const DB_URI = process.env.DB_URI

//DB_Connection
 exports.connectDB = async () => {
    try {
      await mongoose.connect(DB_URI); 
      console.log("Database Connection Successful");
    } catch (err) {
      res.send(err);
    }
  };

  