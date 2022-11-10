import { ScaleLine, defaults as defaultControls } from '/libs/OpenLayers/package_710/control.js';
// import { DragRotateAndZoom, defaults as defaultInteractions } from '/libs/OpenLayers/package_710/interaction.js';
// import DragRotateAndZoom from '/libs/OpenLayers/package_710/interaction.js';

window.onload = init;

function init() {
    const scaleControl = new ol.control.ScaleLine({
        units: 'metric',
        bar: true,
        steps: 4,
        text: true,
        minWidth: 140,
    });

    // const dragControl = new ol.interaction.DragRotateAndZoom();

    const map = new ol.Map({
        // interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        controls: defaultControls().extend([scaleControl]),
        view: new ol.View({
            center: [0, 0], // центрирование карты
            // maxZoom: 15, // максимальный зум
            minZoom: 2, // минимальный зум
            zoom: 2
        }),
        target: 'map'
    })
    
    // Open Street Map
    const OSM = new ol.layer.Tile({
        title: 'OSMStandart',
        source: new ol.source.OSM(),
        visible: false
        // visible: true
    })

    // Google Map

    /*
        Тип карты:
            lyrs=h - roads only (только дороги)
            lyrs=m - standard roadmap (стандартная карта дорог)
            lyrs=p - terrain (ландшафт)
            lyrs=r - somehow altered roadmap (измененная карта дорог)
            lyrs=s - satellite only (вид только со спутника)
            lyrs=t - terrain only (только ландшафт)
            lyrs=y - hybrid (гибридная ???)

        Языки:
            hl=ru - русский язык
            hl=en - английский язык
    */

    const GoogleMap = new ol.layer.Tile({
        title: "GoogleTerrainRoads",
        source: new ol.source.TileImage({ 
            url: 'http://mt1.google.com/vt/lyrs=m&hl=ru&x={x}&y={y}&z={z}'
        }),
        // visible: false
        // visible: true
    })

    // Layer Group - Группа слоёв
    var layerGroup = new ol.layer.Group({
        layers: [
            OSM,
            GoogleMap
        ]
    })
    map.addLayer(layerGroup)

    // Layer Switcher - Переключатель слоёв
    const baseLayerElements = document.querySelectorAll('.sidebar-form > label > input[type=radio]')
    for(let baseLayerElement of baseLayerElements) {
        baseLayerElement.addEventListener('change', function() {
            let baseLayerValue = this.value;
            layerGroup.getLayers().forEach(
                function(element) {
                    let baseLayerTitle = element.get('title');
                    element.setVisible(baseLayerTitle === baseLayerValue);
            })
        })
    }

    // SKFO Data - Северо-Кавказский федеральный округ

    // North Osetia Layer
    const NorthOsetiaGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/SKFO/North_Osetia_Republic.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'SKFO'
    })

    map.addLayer(NorthOsetiaGeoJSON);

    // Markers
    var markers = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: './data/MapMarker.png',
                scale: 0.07
            })
        })
    });
    map.addLayer(markers);

    // Get coordinates on map - получаем координаты по клику
    /*
    map.on('click', function(e) {
        console.log("Lon " + e.coordinate[0])
        console.log("Lat " + e.coordinate[1])
    })
    */
    
    // the code below checks the drawing of marks from an array
    let marksCoords = [[
            [-19.771039603960403, -23.682991601012603],
            [26.753191766545076, -18.43329725640261],
            [56.20603178738928, -18.96637883194518]
        ]
    ];

    map.on('click', function(e) {
        let coordinates = Array(1).fill(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));

        var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([coordinates[0][0], coordinates[0][1]])));
        markers.getSource().addFeature(marker);

        // marksCoords.push(coordinates)
        // console.log(marksCoords)

        document.getElementById('lon').innerText = 'LON: ' + coordinates[0][0].toFixed(7);
        document.getElementById('lat').innerText = 'LAT: ' + coordinates[0][1].toFixed(7);
    });

    /*
    marksCoords.forEach(element => {
        var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([element[0][0], element[0][1]])));
        markers.getSource().addFeature(marker);
    });
    */
   
    /*
    for (let i = 0; i < marksCoords.length; i++) {
        // var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([coords[i].lon, coords[i].lat])));
        var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([marksCoords[i][0], marksCoords[i][1]])));
        markers.getSource().addFeature(marker);
    }
    */
}