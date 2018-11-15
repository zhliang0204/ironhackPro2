
var baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
var address1 = document.getElementById("address1").innerText;
var region = document.getElementById("region").innerText;
var country = document.getElementById('country').innerText;

var curAddress = encodeURI(address1 + "," + region + ","+ country );
var key = 'pk.eyJ1IjoiZWNiaW51MTk5MiIsImEiOiJjam9ldnJ1b2czMGNrM3Byc3phcmV0b2FwIn0.qGy7Y8V4YfU5V6bTNA_ezw';

axios.get(baseUrl + curAddress + ".json?&access_token=" + key).then(response=>{
//   console.log(response.data.features[0].geometry.coordinates);
  var latlng = response.data.features[0].geometry.coordinates;

  mapboxgl.accessToken = 'pk.eyJ1IjoiZWNiaW51MTk5MiIsImEiOiJjam9ldnJ1b2czMGNrM3Byc3phcmV0b2FwIn0.qGy7Y8V4YfU5V6bTNA_ezw';
  var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: latlng,
  zoom: 8
  });

  map.addControl(new mapboxgl.NavigationControl())

    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
    }));


  let marker2 = new mapboxgl.Marker({
    color: '#222222' // Black
  })
    .setLngLat(latlng)
    .addTo(map)


    var distanceContainer = document.getElementById('distance');

    // GeoJSON object to hold our measurement features
    var geojson = {
      "type": "FeatureCollection",
      "features": []
    };
    
    // Used to draw a line between points
    var linestring = {
      "type": "Feature",
      "geometry": {
        'type': "LineString",
        "coordinates": []
        }
    };
    
    map.on('load', function() {
        map.addSource('geojson', {
            "type": "geojson",
            "data": geojson
        });
    
        // Add styles to the map
        map.addLayer({
            id: 'measure-points',
            type: 'circle',
            source: 'geojson',
            paint: {
                'circle-radius': 5,
                'circle-color': '#000'
            },
            filter: ['in', '$type', 'Point']
        });
        map.addLayer({
            id: 'measure-lines',
            type: 'line',
            source: 'geojson',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#000',
                'line-width': 2.5
            },
            filter: ['in', '$type', 'LineString']
        });
    
        map.on('click', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['measure-points'] });
    
            // Remove the linestring from the group
            // So we can redraw it based on the points collection
            if (geojson.features.length > 1) geojson.features.pop();
    
            // Clear the Distance container to populate it with a new value
            distanceContainer.innerHTML = '';
    
            // If a feature was clicked, remove it from the map
            if (features.length) {
                var id = features[0].properties.id;
                geojson.features = geojson.features.filter(function(point) {
                    return point.properties.id !== id;
                });
            } else {
                var point = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            e.lngLat.lng,
                            e.lngLat.lat
                        ]
                    },
                    "properties": {
                        "id": String(new Date().getTime())
                    }
                };
    
                geojson.features.push(point);
            }
    
            if (geojson.features.length > 1) {
                linestring.geometry.coordinates = geojson.features.map(function(point) {
                    return point.geometry.coordinates;
                });
    
                geojson.features.push(linestring);
    
                // Populate the distanceContainer with total distance
                var value = document.createElement('pre');
                value.textContent = 'Total distance: ' + turf.lineDistance(linestring).toLocaleString() + 'km';
                distanceContainer.appendChild(value);
            }
            map.getSource('geojson').setData(geojson);
        });
    });
    
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['measure-points'] });
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : 'crosshair';
    });
    

})

