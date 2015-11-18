var request = require('request');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  var count = 0;
  var stores = [];

  var url = 'http://www.systembolaget.se/api/site/findstoresincountywhereproducthasstock/Stockholms%20l%C3%A4n/896008/1';
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      json['SiteStockBalance'].forEach(function(site) {
        console.log(site);
        count += site['Stock']['Stock'];
        stores.push({
          'store': site['Site']['Name'],
          'stock': site['Stock']['Stock']
        });
      });
    }

    res.render('index', {
      count: count,
      stores: stores
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});