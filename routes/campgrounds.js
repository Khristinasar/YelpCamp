var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware") //we can require only directory, becuase it will automatically require index.js (it's the main file according node_modules -> express)

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from the form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price; //adding price, so it will show up on the show page 
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            //redirect back to campgrounds page
            req.flash("success", "Campground added");
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
}); 

// UPDATE ROUTE 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    //req.body.campground contains name, image and description from edit.ejs 
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;

