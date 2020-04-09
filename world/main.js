let startLayer = L.tileLayer.provider("OpenTopoMap")
let map = L.map("map", {
    center: [30, 0],
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

let drawCircles = function () {
    let data = CONFIRMED;
    let header = CONFIRMED[0];
    let index = document.querySelector("#slider").value;
    // let topic = "bestätigte Fälle"; ->> ersetzt durch let label
    let options = document.querySelector("#pulldown").options;
    let value = options[options.selectedIndex].value;
    let label = options[options.selectedIndex].text;
    let color;

    // console.log(value,label,options);

    if(value==="confirmed"){
        data=CONFIRMED;
        color = "#0074D9";
    } else if (value === "deaths"){
        data = DEATHS;
        color = "#B10DC9";
    } else {
        data = RECOVERED;
        color = "#2ECC40";
    }


    // Datum anzeigen & Thema anzeigen
    document.querySelector("#datum").innerHTML = `am ${header[index]} - ${label}`;

    // "alte" Kreissymbole löschen
    circleGroup.clearLayers();

    //console.log(data);
    for (let i = 1; i < data.length; i++) {
        let row = data[i];
        //console.log(row[2],row[3]);
        let reg = `${row[0]} ${row[1]}`;
        let lat = row[2];
        let lng = row[3];
        let val = row[index];

        if (val===0){
            continue;
        }

        //let mrk = L.marker([lat,lng]).addTo(map);
        //mrk.bindPopup(`${reg}: ${val}`);

        //A = r²*PI
        //r² = A/PI
        //r = WURZEL(A/PI)
        let s = 0.5;
        let r = Math.sqrt(val * s / Math.PI);
        let circle = L.circleMarker([lat, lng], {
            radius: r,
            color: color
        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }
};

// drawCircles(DEATHS);
// drawCircles(RECOVERED);

document.querySelector("#pulldown").onchange = function(){
    drawCircles();

};

let slider = document.querySelector("#slider");
slider.min=4;
slider.max=CONFIRMED[0].length - 1;
slider.step=1;
slider.value = slider.max;

slider.onchange =function(){
    drawCircles();
}

drawCircles();