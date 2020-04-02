//alert("Hallo Welt")

let map = document.querySelector("#map")

// let lat = document.querySelector("div.map.data-lat")
// let lng = document.querySelector("div.map.data-long")

// var mymap = L.map(map).setView([lat, lng], 13);
// // -> dieser Part funktioniert nicht

var mymap = L.map(map).setView([-45.8909481029, 170.6417191], 13);

// L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     maxZoom: 17,
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// }).addTo(mymap);

L.tileLayer.provider('Stamen.Watercolor').addTo(map);

var marker = L.marker([-45.8909481029, 170.6417191]).addTo(mymap);

marker.bindPopup("<b>Sandfly Bay</b><br>a Department of Conservation wildlife reserve").openPopup();

