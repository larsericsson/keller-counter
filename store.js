var request = require('request');

module.exports = function () {
	var store = undefined, timeToLive = 5 * 60 * 1000;

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

						success(store);
					}
				} else {
					error('Could not fetch stores.');
				}
	  		});
		};

		var now = new Date().getTime();
		if (store && store.fetched > now - timeToLive) {
			success(store);
		} else {
			_fetchPagesFrom(1);
		}
	};

	return {
		get: get
	};
}();