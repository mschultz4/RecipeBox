var express = require('express');

var bcrypt = require('bcryptjs');
const saltRounds = 10;

var bodyParser = require('body-parser');
var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var port = process.env.PORT || 5000;

app.use(express.static('./dist'));

app.get('/', function (req, res) {
  res.send('hello');
});

app.get('/api/data', function (req, res) {
  return res.json({
    data: 'hello there'
  });
});


app.post('/api/signup', function (req, res) {

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      console.log(hash);
      var hashPassword = hash;
      var email = req.body.email;
      var user = {
        email: email,
        password: hashPassword
      };
      return res.json({
        message: "user created",
        data: user
      });
    });
  })
});

app.listen(port, function () {
  console.log('Example app listening on port 5000!');
});


// user and persist their recipie
// now localstorage:
