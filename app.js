const express = require("express"); //importing express
const app = express(); //initializing express App
const port = 3000 || process.env.PORT; //server port

const _ = require("lodash"); //importing lodash

const mongoose = require("mongoose"); //importing mongoose
require(__dirname + "/DB/dbConnection.js").connectDB(); //connecting DB
const MODEL = require(__dirname + "/DB/Model.js"); //importing DB-Model

// Global Variables
let docId; // document Id
let dynamicUrl; //dynamic routes
let dynamicUrlModel; //dynamic routes DB_Model

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 
app.set("view engine", "ejs");

//dynamic routes
app.get("/:dynamicRoute", async (req, res) => {
  if (req.params.dynamicRoute != "favicon.ico") {
    dynamicUrl = _.kebabCase(req.params.dynamicRoute);       
    //Dynamic Route Model
    dynamicUrlModel = mongoose.model(dynamicUrl, MODEL.dynamicUrlSchema); 
    
    try {
      const data = await dynamicUrlModel.find(); //fetching data from DB-Dynamic Route Model
      const newArr = data.map((e) => {
        return e.Tasks; // Key/Field
      });
      docId = data.map((e) => {
        return e._id.valueOf(); //document-Id
      });
      res.render("list.ejs", {
        listTitle: _.toUpper(dynamicUrl),
        newListItems: newArr,
        docId: docId, // assigning document-id as element value
      });
    } catch (err) {
      res.send(err);
    }
  }
});

//home route
app.get("/", async (req, res) => {  
  try {
    const data = await MODEL.listModel.find(); //fetching data from DB - listModel/Collection
    const newArr = data.map((e) => {
      return e.ToDoList; //ToDoList Key/Field
    });

    docId = data.map((e) => {
      return e._id.valueOf(); //document-Id
    });
    res.render("list.ejs", {
      listTitle: "ToDoList...",
      newListItems: newArr,
      docId: docId, //assigning document-Id as element value
    });
  } catch (err) {
    res.send(err);
  }
});

//post route
app.post("/", async (req, res) => {
  let item = req.body.newItem; //newData to add  
  try {
    if (req.body.list === "ToDoList...") {
      //creating toDoList Document
      const toDoList = new MODEL.listModel({
        ToDoList: item,
      });
      await toDoList.save(); 
      res.redirect("/"); 
    } else {
      //creating dynamic Route Document
      const dynamicUrlDoc = new dynamicUrlModel({
        Tasks: item,
      });
      await dynamicUrlDoc.save();
      res.redirect(`/${dynamicUrl}`);
    }
  } catch (err) {
    res.send(err);
  }
});

//Delete route/function
app.post("/delete", async (req, res) => {
  let delBtnId = req.body.delBtn; //delete-btn document-Id
  let listName = req.body.listName; //hidden input element name:value
  
  try {
    if (listName === "ToDoList...") {
      // deleting document from home route
      await MODEL.listModel.deleteOne({ _id: delBtnId }); 
      res.redirect("/");
    } else {
      // deleting document from dynamic route
      await dynamicUrlModel.deleteOne({ _id: delBtnId });
      res.redirect(`/${dynamicUrl}`);
    }
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
