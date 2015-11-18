var request = require('request');

module.exports = function () {
	var get = function (success, error) {
		var count = 0, stores = [];

		var fetchPagesFrom = function (page) {
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
						fetchPagesFrom(page + 1)
					} else {
						success(stores, count);
					}
				} else {
					error('Could not fetch stores.');
				}
	  		});
		};

		fetchPagesFrom(1);
	};

	return {
		get: get
	};
}();