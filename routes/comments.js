var express    = require("express"),
    router     = express.Router({mergeParams: true}), //helps route "/campgrounds/:id/comments" in app.js work 
    Campground = require("../models/campground"), //two dots because we need to get out of the folder 'routes'
    Comment    = require("../models/comment"),
    middleware = require("../middleware")

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment 
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment 
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//Comments Edit 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // We define comment_id
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            // Then we define campground_id: req.params.id this is how we pass it through 'campground_id' in edit.ejs
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comment Destroy 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;