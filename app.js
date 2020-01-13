const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Posts = require("./models/posts.js");
const User = require("./models/users.js");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Passport config for authentication
app.use(require("express-session")({
    secret: "Pumpkin is yummy",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//set current user for gatekeeping on edit/deletes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
//function to check if logged in (as there is only one authorized user, auth check is simplified)
const isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//DB connection
mongoose.connect('mongodb+srv://kariminger:12mI94Zzr94P2AY@cluster0-fomve.mongodb.net/test?retryWrites=true&w=majority', 
    {
        useNewURLParser: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=> {
        console.log("connected to database");
    }).catch(err => {
        console.log("ERROR:", err.message);
    });

//---ROUTES---
// Edit
app.get("/edit", isLoggedIn, function(req, res){
    res.render("edit");
});
app.get("/edit/:id", function(req, res){
    Posts.findById(req.params.id).exec(function(err, foundPost){
        if(err){console.log(err);}
        else {
            res.render("edit", {post: foundPost});
        }
    });
});
app.put("/posts/:id", function(req, res){
    Posts.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           res.redirect("/");
       } else {
           res.redirect("/posts/" + req.params.id);
       }
    });
});
// Create
app.get("/new", isLoggedIn, function(req, res){
    res.render("new");
});
app.post("/posts", function(req, res){
    const weekNumber =  req.body.weekNumber;
    const projectName = req.body.projectName;
    const GithubURL = req.body.GithubURL;
    const siteURL = req.body.siteURL;
    const processTxt = req.body.processTxt;
    const challengesTxt = req.body.challengesTxt;
    const takeawaysTxt = req.body.takeawaysTxt;
    const imageName = req.body.imageName;
    const tech = req.body.tech;
    const synopsis = req.body.synopsis;
    const designURL = req.body.designURL;
    
    const newPost = {weekNumber: weekNumber, projectName: projectName, GithubURL: GithubURL, 
        siteURL: siteURL, processTxt: processTxt, challengesTxt: challengesTxt, takeawaysTxt: takeawaysTxt, 
        imageName: imageName, tech: tech, synopsis: synopsis, designURL: designURL};
    Posts.create(newPost, function(err, addedPost){
       if(err){console.log(err);}
       else{res.redirect("/");}
    });
 });
//Login
app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/error"
    }), function(req, res){
});
app.get("/error", function(req, res){
    res.render("error");
});
//Show
app.get("/posts/:id", function(req, res){
    Posts.findById(req.params.id).exec(function(err, foundPost){
       if(err){console.log(err);}
       else {
          res.render("post", {post: foundPost});
       }
    });
});
app.get("/", (req, res) => {
    Posts.find({}, function(err, allPosts){
        if(err){console.log("error in retrieving posts");}
        else{res.render("home", {posts: allPosts});}
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started"); 
 });