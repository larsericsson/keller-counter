var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StoreSchema = new Schema({
  fetched: Number,
  count: Number,
  stores: [{
    store: String,
    stock: Number
  }]
});

StoreSchema.statics.getLatestFetch = function(success, error) {
  console.log('Getting latest fetch');
  var Store = this;
  Store.findOne({}).sort({fetched: -1}).exec(function (err, stores) {
    if (!err && typeof(success) == 'function') success(stores);
    else if (typeof(error) == 'function') error(err);
  });
};

StoreSchema.statics.fetch = function(success, error) {
  console.log('Fetching store from API');
  var Store = this;
  var count = 0;
  var stores = [];
  var _fetchPagesFrom = function(page) {
    console.log('Fetching page ', page);
    var url = 'http://www.systembolaget.se/api/site/findstoresincountywhereproducthasstock/Stockholms%20l%C3%A4n/896008/';

    request(url + page, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        var total = json['DocCount'];

        json['SiteStockBalance'].forEach(function(site) {
          count += site['Stock']['Stock'];
          stores.push({
            'store': site['Site']['Name'],
            'stock': site['Stock']['Stock']
          });
        });

        if (stores.length < total) {
          _fetchPagesFrom(page + 1)
        } else {
          var newStore = new Store({
            fetched: new Date().getTime(),
            count: count,
            stores: stores
          });

          typeof(success) == 'function' && success(newStore);
        }
      } else {
        typeof(error) == 'function' && error('Could not fetch stores.');
      }
      });
  };

  _fetchPagesFrom(1);
};

module.exports = mongoose.model('Store', StoreSchema);