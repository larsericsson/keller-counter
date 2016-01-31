var express = require('express');
var setupDatabase = require('./db.js');
var app = express();
var Store = require('./store.js');

setupDatabase();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {

  Store.getLatestFetch(function (store) {
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
  console.log('Fetching store');
  var result = function (message) {
    res.render('fetch', {
      message: message
    });
  };

  Store.getLatestFetch(function (stores) {
    if (!stores || stores.fetched + 30 * 60 * 1000 < new Date().getTime()) {
      console.log('Old fetch too old, fetching from API');
      Store.fetch(function(store) {
        console.log('Got store ', store);
        store.save(function(err, store) {
          if (err) return result(err);
          result('Saved ' + store.count + ' at ' + store.fetched);
        });
      }, function(err) {
        console.log(err);
        result(err);
      });
    } else {
      result('Already fetched ' + stores.fetched);
    }
  }, function(err) {
    console.log(err);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});