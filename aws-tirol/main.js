let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    layers: [
        startLayer
    ]
});

let overlay = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    wind: L.featureGroup()
}

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
    "Wetterstationen Tirol": overlay.stations, 
    "Temperatur (°C)": overlay.temperature,
    "Windgeschwindigkeit (in km/h)": overlay.wind,
}).addTo(map);

let awsUrl = "https://aws.openweb.cc/stations";


let aws = L.geoJson.ajax(awsUrl, {
    filter: function(feature) {
        console.log("Feature in filter: ", feature);
        // if (feature.properties.LT < 5) {
        //     return true;
        // } else {
        //     return false;
        // }
        // return feature.properties.LT < 5;
        // return feature.geometry.coordinates[2] > 3000;
        return feature.properties.LT !=null;
    },
    pointToLayer: function(point, latlng) {
        // console.log("point: ", point);
        let marker = L.marker(latlng).bindPopup(`
        <h3>${point.properties.name} ${point.geometry.coordinates[2]} m</h3>
        <ul>
        <li>Position: Lat: ${point.geometry.coordinates[1]}/Lng: ${point.geometry.coordinates[0]}</li>
        <li>Datum: ${point.properties.date}</li>
        <li>Lufttemperatur: ${point.properties.LT} °C</li>
        <li>Windgeschwindigkeit: ${point.properties.WG} m/s</li>
        <li>Relative Feuchte: ${point.properties.RH} %</li>
        <li>Schneehöhe: ${point.properties.HS} cm</li>
        </ul>
        <a target="links" href="https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/${point.properties.plot}.png"> Plot zur Wetterstation</a>
        `);
        return marker;
    }
}).addTo(overlay.stations);

let drawTemperature = function(jsonData){
    // console.log("aus der Funktion", jsonData);
    L.geoJson(jsonData, {
        filter: function(feature) {
            return feature.properties.LT
        },
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                title: `${feature.properties.name} (${feature.geometry.coordinates[2]} m)`,
                icon: L.divIcon({
                    html: `<div class="label-temperature">${feature.properties.LT.toFixed(1)}</div>`,
                    className: "ignore-me" // dirty hack
                })
            })
        }
    }).addTo(overlay.temperature);
};


// 1. neues Overlay definieren zu L.control.layers hinzufügen und default anzeigen
// 2. die Funtion drawWind als 1:1 Kopie von drawTemperature mit Anpassungen
// 3. einen neuen Stil .label-wind im css von main.css
// 4. die Funktion drawWind in data:loaded aufrufen

let drawWind = function(jsonData){
    // console.log("aus der Funktion", jsonData);
    L.geoJson(jsonData, {
        filter: function(feature) {
            return feature.properties.WG
        },
        pointToLayer: function(feature, latlng) {
            let kmh = Math.round(feature.properties.WG / 1000*3600);
            return L.marker(latlng, {
                title: `${feature.properties.name} (${feature.geometry.coordinates[2]} m)`,
                icon: L.divIcon({
                    html: `<div class="label-wind">${kmh}</div>`,
                    className: "ignore-me" // dirty hack
                })
            })
        }
    }).addTo(overlay.wind);

};

aws.on("data:loaded", function(){
    //console.log(aws.toGeoJSON());
    drawTemperature(aws.toGeoJSON());

    drawWind(aws.toGeoJSON());

    map.fitBounds(overlay.stations.getBounds());

    overlay.wind.addTo(map);
});