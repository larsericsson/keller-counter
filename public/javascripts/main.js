var kellercounter = {};

kellercounter.map = {
  mapObj: undefined,

  styles: [
    {
      "featureType": "poi",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "water",
      "stylers": [
        { "color": "#619c8d"}//"#5cb29b" }//"#018763" }
      ]
    },{
      "featureType": "landscape",
      "stylers": [
        { "color": "#c7b59a"}//"#d5bc96"}//"#be975b" }
      ]
    },{
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "on" },
        { "color": "#e9e0cd"}//"#f1e3c9" }//"#e9d3ab" }
      ]
    },{
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
    },{
      "featureType": "transit",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "administrative",
      "stylers": [
        { "visibility": "off" }
      ]
    }
  ],

  init: function() {
    console.log(this);

    var styledMap = new google.maps.StyledMapType(this.styles,
      {name: "Styled Map"});

    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(59.3271173, 18.0641056),
      disableDefaultUI: true,
      disableDoubleClickZoom: false,
      draggable: false,
      scrollwheel: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };

    this.mapObj = new google.maps.Map(document.getElementById('map'),
      mapOptions);

    this.mapObj.mapTypes.set('map_style', styledMap);
    this.mapObj.setMapTypeId('map_style');

    document.querySelectorAll('.counter')[0].classList.add('slideup');
  }
};