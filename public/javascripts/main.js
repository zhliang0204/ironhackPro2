
mapboxgl.accessToken = 'pk.eyJ1IjoiZWNiaW51MTk5MiIsImEiOiJjam9ldnJ1b2czMGNrM3Byc3phcmV0b2FwIn0.qGy7Y8V4YfU5V6bTNA_ezw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v10',
center: [13,52],
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


var baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
var address1 = document.getElementById("address1").innerText;
var address2 = document.getElementById("address2").innerText;
var country = document.getElementById('country').innerText;

var curAddress = encodeURI(address1 + "," + address2+ "," + country );
var key = 'pk.eyJ1IjoiZWNiaW51MTk5MiIsImEiOiJjam9ldnJ1b2czMGNrM3Byc3phcmV0b2FwIn0.qGy7Y8V4YfU5V6bTNA_ezw';
// console.log(baseUrl + curAddress + ".json?&access_token=" + key);
// console.log( curAddress );



axios.get(baseUrl + curAddress + ".json?&access_token=" + key).then(response=>{
  // console.log(response.data.features[0].geometry.coordinates);
  var latlng = response.data.features[0].geometry.coordinates;
  let marker2 = new mapboxgl.Marker({
    color: '#222222' // Black
  })
    .setLngLat(latlng)
    .addTo(map)

})






