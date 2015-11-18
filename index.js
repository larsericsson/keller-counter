var express = require('express');
var app = express();
var Store = require('./store.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {

  Store.get(function (stores, count) {
    res.render('index', {
      count: count,
      stores: stores
    });
  }, function (error) {
    console.log('Got error: ' + error);
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});