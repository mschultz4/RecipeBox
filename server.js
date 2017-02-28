"use strict";

let express     = require('express'),
    app         = express(),
    MongoClient = require('mongodb').MongoClient, 
    assert      = require('assert'),
    bcrypt      = require('bcryptjs'),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    userCollection,
    recipeCollection;

const saltRounds = 10,
      port       = process.env.PORT || 443,
      ip         = process.env.ip,
      url        = 'mongodb://localhost:27017/recipes';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  userCollection = db.collection('users'); 
  recipeCollection = db.collection('recipes');
});

//app.use(express.static('./dist'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));

app.get('/', function (req, res) {
  res.render('./dist/index.html');
});

app.get('/api/data', function (req, res) {
  return res.json({
    data: 'hello there'
  });
});

app.post('/api/signup', function (req, res) {
    userCollection
      .findOne({"email": req.body.email})
      .then(function(user){
        if (user){
            return res.json({"message": "user already exists"});
        }
        
      bcrypt.genSalt(saltRounds, function(err, salt) {
        assert.equal(null, err);
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          assert.equal(null, err);
          var user = {
            email: req.body.email,
            password: hash
          };
          
          userCollection.insertOne({email: req.body.email, password: hash});
          
          return res.json({
            message: "user created",
            authenticated: true,
            data: user
          });
        });
      });
    });
});

app.post('/api/signin', function(req, res){
  userCollection.findOne({email: req.body.email}).then(function(user){
    if (!user) {
      return res.json({
        message: "user not found",
        authenticated: false
      });
    }
    
    bcrypt.compare(req.body.password, user.password, function(err, authenticated){
        assert.equal(err, null);
        return res.json({authenticated: authenticated});
    });
  });
  
});

app.get('/api/recipes/:creator_id', function(req, res){
    recipeCollection
      .find({}, {creator_id: req.params.creator_id}, function(err, recipes){
        assert.equal(err, null);
        res.json(recipes.toArray());
      });
});

app.post('/api/recipes', function(req, res){
    recipeCollection
      .insertOne({
        creator_id: req.body.creator_id,
        recipe : req.body.recipe
      })
      .then(function(document){
        res.json({
          "message": "recipe created",
          "document": document
        });
      });
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});


// user and persist their recipie
// now localstorage:
