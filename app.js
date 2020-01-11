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
app.get("/login", function(req, res){
    res.render("login");
 });
app.get("/posts/:id", function(req, res){
    Posts.findById(req.params.id).exec(function(err, foundPost){
       if(err){console.log(err);}
       else{
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