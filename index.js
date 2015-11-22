var express = require('express');
var app = express();
var Store = require('./store.js');
var DB = require('./db.js');

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

app.get('/fetch', function(req, res) {
  var result = function (message) {
    res.render('fetch', {
      message: message
    });
  };

  DB.getLatestFetch(function (stores) {
    if (stores.fetched + 30 * 60 * 1000 < new Date().getTime()) {
      Store.get(function (store) {
        DB.save(store, function () {
          result('Saved ' + store.count + ' at ' + store.fetched);
        });
      }, function (error) {
        console.log('Got error: ' + error);
      });
    } else {
      result('Already fetched ' + stores.fetched);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});