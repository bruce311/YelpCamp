const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });

//Schema Setup

const  campgroundSchema = new mongoose.Schema({
        name: String,
        image: String,
        description: String
});

const Campground = mongoose.model("Campground", campgroundSchema); //also creates the methods 

Campground.create(
     {
         name: "Granite Hill", 
         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
         description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
     },
     function(err, campground){
      if(err){
          console.log(err);
      } else {
          console.log("NEWLY CREATED CAMPGROUND: ");
          console.log(campground);
      }
    });

// const campgrounds = [
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];

app.get("/", function(req, res){
	res.render("landing.ejs");
});

//INDEX
app.get("/campgrounds", function(req, res){ 
        //res.render("campgrounds", {campgrounds: campgrounds})
        Campground.find({},function(err, newCampground){ //find all the elements and make them into an array
                if(err){
                        console.log(err);
                } else {
                        res.render("index.ejs", {campgrounds:newCampground});
                }
        });
}); 

//NEW
app.get("/campgrounds/new", function(req, res){
	res.render("news")
}); 

//CREATE
app.post("/campgrounds", function(req, res){
	const name = req.body.name;
        const image = req.body.image;
        const description = req.body.description;
        const newCampground = {name: name, image: image, description: description}; 
        
        Campground.create(newCampground, function(err, newcampground){
                if(err){
                        console.log(err); //more err handling later
                } else {
                        res.redirect("/campgrounds");
                        //console.log(newcampground);
                }
        });

	//campgrounds.push(newCampground);
	//res.redirect("/campgrounds"); //when redirect, the default is redirect as a get request
}); 

//SHOW
app.get("/campgrounds/:id", function(req, res){
        //find the campground with provided ID
        //render show template with that campground
        Campground.findById(req.params.id, function(err, campgroundFound){
                if(err){
                        console.log(err);
                } else {
                        res.render("show.ejs", {campground: campgroundFound});
                }
        });
});

app.listen(3000, function(){
	console.log("App is host on local host 3000!");
})