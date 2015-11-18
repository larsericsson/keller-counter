var express = require('express');
var app = express();
var Store = require('./store.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {

  Store.get(function (store) {
    res.render('index', {
      count: store.count,
      stores: store.stores,
      fetched: store.fetched
    });
  }, function (error) {
    console.log('Got error: ' + error);
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});