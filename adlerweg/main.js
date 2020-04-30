let startLayer = L.tileLayer.provider("BasemapAT.terrain");

let map = L.map("map", {
    center: [47.25, 11.5],
    zoom: 9,
    layers: [
        startLayer
    ]
});

let overlay={
    adlerblicke: L.featureGroup()
};

L.control.layers({
    "BasemapAT.grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": startLayer,
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Adlerblicke": overlay.adlerblicke
}).addTo(map);

// console.log(ADLERBLICKE); //schauen, ob Etappen-File eingebunden wurde


for (const blick of ADLERBLICKE) {
    // console.log(blick);
    let mrk = L.marker([blick.lat,blick.lng], {
        icon: L.icon({
            iconSize: [32, 37], //automatisches zentrieren, wenn Bildgröße bekannt
            iconAnchor: [16, 37], //um Bild zu zentrieren
            popupAnchor: [0, -37], //37 Pixel nach oben verschieben
            iconUrl: "icons/panoramicview.png"
        })
    }).addTo(overlay.adlerblicke);
    // L.marker([blick.lat,blick.lng]).addTo(map); //Testmarker um Anfasspunkte zu testen
    mrk.bindPopup(`Standort ${blick.standort} (${blick.seehoehe}m)`);
}
overlay.adlerblicke.addTo(map);


// pointToLayer: function(feature, latlng) {
//     return L.marker(latlng, {
//         title: `${feature.properties.standort} (${feature.geometry.coordinates[2]}m)`,
//         icon: L.divIcon({
//             html: `<div class="label-temperature" style="background-color:${color}">${feature.properties.LT.toFixed(1)}</div>`,
//             className: "ignore-me" // dirty hack
//         }


// onEachFeature: function (feature, layer){
//     console.log("Wanderweg Feature", feature);
//     layer.bindPopup(`${feature.properties.standort} ${feature.properties.seehoehe}`)
// }
// }).addTo(map)