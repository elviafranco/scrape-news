const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 8667;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Static directory
app.use(express.static(__dirname + "/public"));

// Set Handlebars.
const exphbs = require("express-handlebars");
// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main", }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user:password567@ds141937.mlab.com:41937/heroku_jvfn8n93";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true,
  useUnifiedTopology: true});

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI || "mongodb://localhost/scrapenews", { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect("mongodb://localhost/scrapenews", { useNewUrlParser: true, useUnifiedTopology: true });

// Routes

// Gets all articles + renders handlebars home
app.get("/", function (req, res) {
  db.Article.find({}).then(function (dbArticle) {
    const obj = { article: dbArticle };
    // console.log(obj)
    res.render("index", obj);
  });
});

// Scrape articles + create db collection
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://time.com/tag/crime/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      const result = {};

      // Add the text and href of every link, and save them as properties of the result object
      // if (result.title && result.summary) {

      result.title = $(this)
      .children("div")
        .children("h3")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div")
        .children("div")
        .siblings()
        .text();
      result.link = $(this)
      .children("div")
        .children("h3")
        .children("a")
        .attr("href");

      // console.log(result)

      // Create a new Article using the `result` object built from scraping

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
      });
    });

    // Send a message to the client
    res.redirect("/");
  });
});

// Gets all saved articles + renders saved page
app.get("/saved", function(req, res) {
  db.Article.find({"saved": true})
  .then (function(articles) {
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  })
    .catch(function (err) {
      res.json(err);
  });
});

// Save an article + post to /saved
app.post("/articles/save/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ _id: req.params.id }, { "saved": true})
  .then(function (data) {
    res.json(data);
})
.catch(function (err) {
    res.json(err);
});;
});


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's comment
app.get("/articles/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
    .populate({
      path: 'comment',
      model: 'Comment'
  })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {  
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Comment
app.post("/comment/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comment: dbComment._id }}, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/comment/:id", function (req, res) {
  db.Comment.findByIdAndRemove({ _id: req.params.id })
      .then(function (dbComment) {

          return db.Article.findOneAndUpdate({ comment: req.params.id }, { $pullAll: [{ comment: req.params.id }]});
      })
      .then(function (dbArticle) {
          res.json(dbArticle);
      })
      .catch(function (err) {
          res.json(err);
      });
});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});