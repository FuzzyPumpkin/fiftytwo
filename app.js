const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Posts = require("./models/posts.js");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));


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

//Routes
app.get("/edit", function(req, res){
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
app.get("/new", function(req, res){
    res.render("new");
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

app.get("/login", function(req, res){
    res.render("login");
});

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


app.listen(port, function() {console.log("server started");});