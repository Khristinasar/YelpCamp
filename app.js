var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    User           = require("./models/user"),
    seedDB         = require("./seeds")
    //Campground   = require("./models/campground") 
    //Comment      = require("./models/comment")
    
// Requiring routes   
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect("mongodb://localhost/yelp_camp_v14");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); //has to be before passport configuration 
// seedDB(); //seed the database 

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "Once again Rusty wins",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// It helps to check if user is logged in -> shows correct buttons(login, logout) depending whether user is logged in
// We can call it our own middleware 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Express router
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //"/camp.." helps to shorter routes. Now we write just "/" in campgrounds.js. 
app.use("/campgrounds/:id/comments", commentRoutes); //in order to make it work we need to add {mergeParams: true} in var router in comments.js

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});