let startLayer = L.tileLayer.provider("BasemapAT.terrain");

let map = L.map("map", {
    center: [47.25, 11.5],
    zoom: 9,
    layers: [
        startLayer
    ]
});

let overlay={
    adlerblicke: L.featureGroup(),
    etappen: L.featureGroup(),
    einkehr: L.featureGroup(),
    wikipedia: L.featureGroup()
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
    "Adlerblicke": overlay.adlerblicke,
    "Adlerweg Etappen": overlay.etappen,
    "Einkehrmöglichkeiten": overlay.einkehr,
    "Wikipedia Artikel": overlay.wikipedia
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

let drawEtappe = function(nr){
    overlay.etappen.clearLayers(); // bestehende Etappe löschen

    console.log(ETAPPEN[nr].track);
    let track = ETAPPEN[nr].track.replace("A",""); // A mit nichts ersetzen (bei Benennung in track-Attribute)
    console.log(track);

    let gpx = new L.GPX(`gpx/AdlerwegEtappe${track}.gpx`, {
        async: true,
        marker_options: {
            startIconUrl: `icons/number_${nr}.png`, 
            endIconUrl: 'icons/finish.png',
            shadowUrl: null, // eigene Grafik die Schatten macht, brauchen wir nicht deshalb null
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37]
        },
        polyline_options: {
            color: "black",
            dashArray: [2,5]
        }
    });
    
    gpx.on("loaded", function(evt){
        map.fitBounds(evt.target.getBounds());

        controlElevation.clear(); //damit nicht immer dazugezeichnet wird, zuerst bestehendes Profil löschen
        controlElevation.load(`gpx/AdlerwegEtappe${track}.gpx`);
    }).addTo(overlay.etappen);
    overlay.etappen.addTo(map);

    //Schleife geht alle Infos des Objekts durch (zuvor im Index.html beschrieben) -> um Texte entsprechend der Etappe anzupassen
    for (const key in ETAPPEN[nr]) {
            const element = ETAPPEN[nr][key];
            console.log(`et-${key}`);
            let elem = document.querySelector(`#et-${key}`);
            if (elem) {
                elem.innerHTML = ETAPPEN[nr][key];
            }
    }
};
drawEtappe(1);

let pulldown = document.querySelector("#pulldown"); // in index.html erzeugtes Pulldown ansprechen
console.log(pulldown);

for (let i = 1; i < ETAPPEN.length; i++) {
    const etappe = ETAPPEN[i];
    console.log(etappe);
    pulldown.innerHTML += `<option value ="${i}">${etappe.titel}</option>`; 
}
// Etappenpulldown aktivieren (über klick ändern sich die angezeigten Etappen)
pulldown.onchange = function(evt) {
    let nr = evt.target.options[evt.target.options.selectedIndex].value;
    //console.log(nr);
    drawEtappe(nr);
}


let drawEinkehr = function (){
    for (let einkehr of EINKEHR) {
        console.log(einkehr);
        let mrk = L.marker([einkehr[2], einkehr [3]],{
            icon: L.icon({
                iconSize: [32, 37], //automatisches zentrieren, wenn Bildgröße bekannt
                iconAnchor: [16, 37], //um Bild zu zentrieren
                popupAnchor: [0, -37], //37 Pixel nach oben verschieben
                iconUrl: "icons/restaurant.png"
            })
            }).addTo(overlay.einkehr);
            mrk.bindPopup(`${einkehr[1]} (Etappe ${einkehr[0]})`) //zeigt Spalte 2 (1) und 1 (0) an

    }
};
drawEinkehr(); //Funktion einmal aufrufen, damit sie ausgeführt wird
overlay.einkehr.addTo(map);

let controlElevation = L.control.elevation({
    theme: "adler-theme", //wie das Profil ausschaut -> ist im Leaflet dokumentiert (oder über coustum und mit css stylen)
    detached: true, //außerhalb der Karte anzeigen
    elevation: "#profile", //div im html ansteuern
    followMarker: false
}).addTo(map);

L.control.scale({
    imperial: false //nicht-metrische Werte weglassen
}).addTo(map); //erzeugt einen Maßstab links unten bei der Karte

map.on("zoomend moveend", function (evt){
    let ext = {
        north: map.getBounds().getNorth(),
        south: map.getBounds().getSouth(),
        east: map.getBounds().getEast(),
        west: map.getBounds().getWest()
    };
    let url = `https://secure.geonames.org/wikipediaBoundingBoxJSON?north=${ext.north}&south=${ext.south}&east=${ext.east}&west=${ext.west}&username=feielp98&lang=de&maxRows=30`;
    console.log(url);

    let wiki = L.Util.jsonp(url).then(function(data){
        //console.log(data.geonames);
        for (let article of data.geonames){
            let png ="";
            // console.log(article.feature)
            switch (article.feature){
                case "city":
                    png="city.png";
                    break;
                case "landmark":
                    png="landmark.png";
                    break;
                case "waterbody":
                    png="lake.png";
                    break;
                case "river":
                    png="river.png";
                    break;
                case "mountain":
                    png="mountains.png";
                    break;
                default:
                    png="information.png";
            }
            console.log(png);

            let mrk = L.marker([article.lat,article.lng], {
                // icon: L.icon({
                //     iconSize: [32, 37], //automatisches zentrieren, wenn Bildgröße bekannt
                //     iconAnchor: [16, 37], //um Bild zu zentrieren
                //     popupAnchor: [0, -37], //37 Pixel nach oben verschieben
                //     iconUrl: "icons/restaurant.png"
            }).addTo(overlay.wikipedia);
            mrk.bindPopup(`
                <small>${article.feature}</small>
                <h3>${article.title} (${article.elevation}m)</h3>
                <p>${article.summary}</p>
                <a target="wikipedia" href="https://${article.wikipediaUrl}">Wikipedia Artikel</a>
            `)
            //console.log(article);
        }
    });
});
overlay.wikipedia.addTo(map);

//http://api.geonames.org/wikipediaSearchJSON?q=london&maxRows=10&username=feielp98&lang=de&maxRows=30

//city -> Tourism
// landmark -> Tourism
// waterbody -> Nature
// river -> Nature
// mountains -> Nature
// Standardicon: Tourism -> information.png

// Icon implementieren