const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

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

const PostSchema = new mongoose.Schema({
    weekNumber: String,
    projectName: String,
    GithubURL: String,
    siteURL: String,
    processTxt: String,
    challengesTxt: String,
    takeawaysTxt: String,
    imageName: String,
    tech: Array
});
const Post = mongoose.model("Post", PostSchema);



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.get("/edit", function(req, res){
    res.render("edit");
 });
app.get("/login", function(req, res){
    res.render("login");
 });
app.get("/post", function(req, res){
    res.render("post");
 });

app.get("/", async (req, res) => {
    let post = await Post.create({
        weekNumber: "0",
        projectName: "Test project name",
        GithubURL: "https://github.com/FuzzyPumpkin/fiftytwo",
        siteURL: "https://fuzzypumpkin.github.io/",
        processTxt: "I followed a process, really",
        challengesTxt: "Challenges are just tests with a longer name.",
        takeawaysTxt: "Calgon!",
        imageName: "testImg",
        tech: ["Node.js", "Sass"]}
    );
    res.send(post)
    // res.render("home");
 });





app.listen(port, function() {console.log("server started");});