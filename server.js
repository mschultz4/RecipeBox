"use strict";

let express    = require('express');
let app        = express();
let pgp        = require('pg-promise')();
let assert     = require('assert');
let bcrypt     = require('bcryptjs');
let bodyParser = require('body-parser');
let path       = require('path');
let queries    = require("./server/queries.js");

const saltRounds = 10;
const port       = 8080;
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/recipebox';

let cn = {
    host: "localhost",
    port: 5432,
    database: 'recipebox',
    pools: 10,
    user: 'mschultz'
};

const db = pgp(cn);

//app.use(express.static('./dist'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));

app.get('/', function (req, res) {
  res.render('./dist/index.html');
});

app.post('/api/saverecipe', function (req, res) {
  db.tx(t => {
      return t.one(queries.insertRecipe, req.body)
          .then(data => {
            let ingredientsQueries = req.body.ingredients.map(ing => {
              return t.none(queries.insertIngredient, Object.assign({}, {recipeid: data.recipeid}, ing));
            });

            let instructionsQueries = req.body.instructions.map(ins => {
              return t.none(queries.insertInstruction, Object.assign({}, {recipeid: data.recipeid}, ins));
            });
            console.log(req.body);
              
            return t.batch([].concat(ingredientsQueries, instructionsQueries));
          });
  })
  .then(events => {
      console.log(events);
  })
  .catch(error => {
      console.log(error);
      // error
  });

  return res.json(req.body);
});

app.get('/api/recipes/', function(req, res){
  var recipes;
  db.one(queries.selectRecipes)
  .then(data => {
      return res.json(data);
  })
  .catch(error => {
      console.log(error);
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

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});