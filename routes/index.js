var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user")

// Root route
router.get("/", function(req, res){
    res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

// Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message); //to show the message about what's wrong
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// Show login form
router.get("/login", function(req, res){
  res.render("login"); 
});
    
// Handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        successFlash: "Welcome back!",
        failureRedirect: "/login",
        failureFlash: "Username or password is incorrect."
        
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged You Out!");
   res.redirect("/campgrounds");
});

module.exports = router;