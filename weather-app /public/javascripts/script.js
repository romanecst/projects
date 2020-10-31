var mymap = L.map('worldmap',
{
 center: [48.866667, 2.333333],
 zoom: 4
}
);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);


var ville = document.getElementsByClassName('ville');

for(var i=0; i<ville.length; i++){
    var lon = ville[i].dataset.lon;
    var lat = ville[i].dataset.lat;
    var city = ville[i].dataset.city;

    L.marker([lat, lon]).addTo(mymap).bindPopup(city);
};

