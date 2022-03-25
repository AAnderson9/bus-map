(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);
    busLayer = L.geoJSON(null,{
        pointToLayer: function (feature,latlng) {
            return L.marker(latlng, {icon: feature.properties.icon, rotationAngle: feature.properties.rotationAngle});
        },
        onEachFeature: function (feature,layer) {
            layer.bindPopup("Route Number: " + feature.properties.routeId);
        }
    }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    setInterval(updateMap,7000,map); 

})();

function updateMap(map)
{
    //add a marker for each bus location
    fetch('http://hrmbusapi.herokuapp.com/')
    .then(res => res.json())
    .then(json => {

        busLayer.clearLayers();

        //change from array to object
        json.entity.filter(el => el.vehicle.trip.routeId >= 1 && el.vehicle.trip.routeId <= 10).map(el => {
            const lat = el.vehicle.position.latitude;
            const long = el.vehicle.position.longitude;
            const routeId = el.vehicle.trip.routeId;
            const rotationAngle = el.vehicle.position.bearing;

            const busIcon = L.icon({
                iconUrl: 'bus.png',
    
                iconSize: [38,40],
                iconAnchor: [22,20],
                popupAnchor: [2, 2]
            });



            busLayer.addData(generateGeoFromLatLong(lat,long,routeId,busIcon,rotationAngle));

       });

    
    }); 
}

function generateGeoFromLatLong(lat, long, routeId, icon, rotationAngle)
{
    return geoObj = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [long, lat]
        },
        "properties": {
            "routeId": routeId,
            "icon": icon,
            "rotationAngle": rotationAngle
        }
    }
}