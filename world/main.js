let startLayer = L.tileLayer.provider("OpenTopoMap")
let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

let circleGroup = L.featureGroup().addTo(map);

L.control.layers({
    "OpenTopoMap": startLayer,
    "OpenStreetMap.Mapnik": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    // "Stadia.OSMBright": L.tileLayer.provider("Stadia.OSMBright"),
    "Thunderforest.OpenCycleMap": L.tileLayer.provider("Thunderforest.OpenCycleMap"),
    "CyclOSM": L.tileLayer.provider("CyclOSM"),
    "OpenMapSurfer.Roads": L.tileLayer.provider("OpenMapSurfer.Roads")
}, {
    "Thematische Darstellung": circleGroup
}).addTo(map);

let drawCircles = funtion(data) {
    // L.marker([0,0]).addTo(map);


    //console.log(CONFIRMED);


    //Mit for-Schleife alle Marker aus dem Datenfile zur Karte hinzufügen
    for (let i = 1; i < CONFIRMED.length; i++) {
        let row = CONFIRMED[i];
        //console.log(row[2],row[3]);
        let reg = `${row[2],row[3]}`;
        let lat = row[2];
        let lng = row[3];

        let val = row[row.length - 1];
        // let mrk = L.marker([row[2], row[3]]).addTo(map);
        // mrk.bindPopup(`${row[0]} ${row[1]}:${val}`);

        //Kreis-Symbole berechnen (Flächengröße)
        //A=r2*Pi
        //r=WURZEL(A/Pi)
        let s = 0.25
        let r = Math.sqrt(val * s / Math.PI);


        let circle = L.circleMarker([lat, lng], {
            radius: r

        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }

};