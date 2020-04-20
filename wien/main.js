let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [48.208333, 16.373056],
    zoom: 12,
    layers: [
        startLayer
    ]
});

let sightGroup = L.markerClusterGroup().addTo(map);
let walkGroup = L.featureGroup().addTo(map);
let heritageGroup = L.featureGroup().addTo(map);

L.control.layers({
    "BasemapAT.grau": startLayer,
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}, {
    "Stadtspaziergang (Punkte)": sightGroup,
    "Wanderungen": walkGroup,
    "Weltkulturerbe": heritageGroup

}).addTo(map);

let sightUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERPUNKTOGD &srsName=EPSG:4326&outputFormat=json";



let sights = L.geoJson.ajax(sightUrl, {
    pointToLayer: function (point, latlng) {
        let icon = L.icon({
            iconUrl: 'icons/sight.svg',
            iconSize: [32, 32]
        });
        let marker = L.marker(latlng, {
            icon: icon
        });
        // console.log("Point", point);

        //Variable für "keine Anmerkung verfügbar"
        let anmerkung;
        if (point.properties.BEMERKUNG == null) {
            anmerkung = "keine näheren Informationen vorhanden";
        } else {
            anmerkung = point.properties.BEMERKUNG;
        }

        marker.bindPopup(`<h3>${point.properties.NAME}</h3>
        <p>${anmerkung}</p>
        <p><b></b>Adresse:</b> ${point.properties.ADRESSE}</p>
        <p><a target="links" href="${point.properties.WEITERE_INF}">Link</a></p>
        `);
        return marker;
    }
});

sights.on("data:loaded", function () {
    sightGroup.addLayer(sights);
    console.log('data loaded!');
    map.fitBounds(sightGroup.getBounds());
});

let wandern = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WANDERWEGEOGD&srsName=EPSG:4326&outputFormat=json";

L.geoJson.ajax(wandern, {
    // style: function () {
    //     return {
    //         color: "green",
    //         weight: 5
    //     };
    style: function (feature) {
        if (feature.properties.TYP = "1") {
            return {
                color: "black",
                dashArray: "10,10"
            };
        } else if (feature.properties.TYP = "2") {
            return {
                color: "black",
                dashArray: "5,20"
            };
        }
},
onEachFeature: function (feature, layer){
    console.log("Wanderweg Feature", feature);
    layer.bindPopup(`${feature.properties.BEZ_TEXT}`)
}
}).addTo(walkGroup);

let heritage = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";

L.geoJson.ajax(heritage, {
    style: function (feature) {
        if (feature.properties.TYP = "1") {
            return {
                color: "red",
                fillOpacity: 0.3
            };
        } else if (feature.properties.TYP == "2") {
            return {
                color: "yellow",
                fillOpacity: 0.3
            };
        }
    },
    onEachFeature: function (feature, layer) {
        // console.log("Feature: ", feature);
        // FLÄCHEN SORTIEREN - VERSUCHE 1 bis 3
        // if (feature.properties.TYP = "1") {
        //     layer.bringToFront();
        // };
        // layer.bringToFront();
        // if (feature.properties.TYP = "1") {
        //         layer.bringToFront();
        //     } else if (feature.properties.TYP = "2"){
        //         layer.bringToBack();
        //     }
        layer.bindPopup(`<h3>${feature.properties.NAME}</h3>
        <p>${feature.properties.INFO}</p>
        `);
    }
}).addTo(heritageGroup);