
function map() {
	//set API token
	mapboxgl.accessToken = 'pk.eyJ1IjoibG9pc2RldyIsImEiOiJjazhrNTJxMTgwMXh4M2Zua3ZtYXk0Mno2In0.Mx7xdxB8FiRhMY41l_gmXg';
	    var map = new mapboxgl.Map({
	        container: 'map', // container id
	        style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
	        center: [4.768274, 52.310539], // starting position [lng, lat]
	        zoom: 7 // starting zoom
	    });


	var popup = new mapboxgl.Popup()
	.setHTML('<h2>Schiphol Airport</h2><h3>Dit is momenteel de beste plek om te landen.</h3>');

	// Adding a marker based on lon lat coordinates
	var marker = new mapboxgl.Marker()
	.setLngLat([4.768274, 52.310539])
	.setPopup(popup)
	.addTo(map);


	var cities = [
	  {
	    name: 'Amsterdam',
	    coordinates: [4.895168, 52.370216]
	  },

	];

	var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
	var openWeatherMapUrlApiKey = '6a719e3c4dfb752cbb9fe577d9c14591';

	map.on('load', function () {
	  cities.forEach(function(city) {
	    // Usually you do not want to call an api multiple times, but in this case we have to
	    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
	    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

	    // Get current weather based on cities' coordinates
	    fetch(request)
	      .then(function(response) {
	        if(!response.ok) throw Error(response.statusText);
	        return response.json();
	      })
	      .then(function(response) {
	        // Then plot the weather response + icon on MapBox
	        plotImageOnMap(response.weather[0].icon, city)
	      })
	      .catch(function (error) {
	        console.log('ERROR:', error);
	      });
	  });
	});



	function plotImageOnMap(icon, city) {
	  map.loadImage(
	    'http://openweathermap.org/img/w/' + icon + '.png',
	    function (error, image) {
	      if (error) throw error;
	      map.addImage("weatherIcon_" + city.name, image);
	      map.addSource("point_" + city.name, {
	        type: "geojson",
	        data: {
	          type: "FeatureCollection",
	          features: [{
	            type: "Feature",
	            geometry: {
	              type: "Point",
	              coordinates: city.coordinates
	            }
	          }]
	        }
	      });
	      map.addLayer({
	        id: "points_" + city.name,
	        type: "symbol",
	        source: "point_" + city.name,
	        layout: {
	          "icon-image": "weatherIcon_" + city.name,
	          "icon-size": 1.3
	        }
	      });
	    }
	  );
	}
}
map();