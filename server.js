var express     = require('express'),
    MongoClient = require('mongodb').MongoClient, 
    assert      = require('assert'),
    bcrypt      = require('bcryptjs'),
    bodyParser  = require('body-parser'),
    app         = express(),
    userCollection;

const saltRounds = 10,
      port       = process.env.PORT || 5000,
      ip         = process.env.ip,
      url        = 'mongodb://localhost:27017/recipes';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  userCollection = db.collection('users'); 
});

app.use(express.static('./dist'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.render('./dist/index.html');
});

app.get('/api/data', function (req, res) {
  return res.json({
    data: 'hello there'
  });
});


app.post('/api/signup', function (req, res) {

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
        data: user
      });
    });
  });
});

app.listen(port, function () {
  console.log('Example app listening on port 5000!');
});


// user and persist their recipie
// now localstorage:
