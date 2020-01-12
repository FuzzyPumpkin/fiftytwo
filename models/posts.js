const mongoose = require("mongoose");


const PostSchema = new mongoose.Schema({
    weekNumber: String,
    projectName: String,
    GithubURL: String,
    siteURL: String,
    processTxt: String,
    challengesTxt: String,
    takeawaysTxt: String,
    imageName: String,
    tech: String,
    synopsis: String,
    designURL: String
});

module.exports = mongoose.model("Post", PostSchema);