//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const app = express();
 



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});


const itemsSchema=new mongoose.Schema({
  name:String
});

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist"
});


const item2=new Item({
  name:"Hit the + button to add a new item"
});


const item3=new Item({
  name:"<--Hit this to delete a item"
});


const defaultItems=[item1, item2, item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

/*Item.insertMany(defaultItems)
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
*/

app.get("/", function(req, res) {


  Item.find({}).then(function(foundItems){

    if(foundItems.length==0)
    {
      Item.insertMany(defaultItems)
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });

      res.redirect("/");
    }
   
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
  }).catch(function(err){
    console.log(err);

  });


});


app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;


  List.findOne({name:customListName}).then((foundList)=>{

    if(foundList)
    {
      console.log("Exists");
    }
}).catch((err)=>{
  console.log("Doesn't exists");
});

  const list=new List({
    name:customListName,
    items:defaultItems
  });

  list.save();
});



app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item=new Item({name:itemName});
  item.save();
  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId).then(function(){
    console.log("Successfully deleted the item");
    res.redirect("/");
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
