var request = require('request');
var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
  fetched: Number,
  count: Number,
  stores: [{
    store: String,
    stock: Number
  }]
});

storeSchema.method.save = function(stores, success, error) {
  new Store(stores).save(function (err) {
    if (err && typeof(error) == 'function') error(err);
    else if (typeof(success) == 'function') success();
  });
};

storeSchema.static.getLatestFetch = function(success, error) {
  Store.findOne({}).sort({fetched: -1}).exec(function (err, stores) {
    if (!err && typeof(success) == 'function') success(stores);
    else if (typeof(error) == 'function') error(err);
  });
};

var Store = mongoose.model('Store', storeSchema);

// Refactor this into service or static method
module.exports = function () {
  var store = undefined, timeToLive = 1 * 60 * 1000;

  var get = function (success, error) {
    var count = 0, stores = [], _fetchPagesFrom = function (page) {
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
            store = {
              fetched: new Date().getTime(),
              count: count,
              stores: stores
            };

            typeof(success) == 'function' && success(store);
          }
        } else {
          typeof(error) == 'function' && error('Could not fetch stores.');
        }
        });
    };

    var now = new Date().getTime();
    if (store && store.fetched > now - timeToLive) {
      typeof(success) == 'function' && success(store);
    } else {
      _fetchPagesFrom(1);
    }
  };

  return {
    get: get
  };
}();