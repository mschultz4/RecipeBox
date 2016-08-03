var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static('./dist'));

app.get('/', function (req, res) {
  res.send('hello');
});


app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
