const mongoose = require("mongoose"); 

//creating home route list Schema
const listSchema = new mongoose.Schema({
    ToDoList: String,
  });

//creating & exporting Dynamic Route list Schema
exports.dynamicUrlSchema = new mongoose.Schema({
    Tasks: {},
  });

//creating & exporting Home Route list Model - Collection/Table
exports.listModel = mongoose.model("homeList", listSchema);

