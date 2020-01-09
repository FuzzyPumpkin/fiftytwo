const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.get("/post", function(req, res){
    res.render("post");
 });

app.get("/", function(req, res){
    res.render("home");
 });

app.listen(port, function() {console.log("server started");});