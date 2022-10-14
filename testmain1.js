window.onload = initOSM;

// Open Steet Map function
function initOSM() {
    var mapOSM = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            projection: 'EPSG:4326',
            // maxZoom: 10,
            zoom: 3
        }),
        layers: [
            new ol.layer.Tile({
                title: 'OSMStandart',
                source: new ol.source.OSM()
            })
        ]
    })

    mapOSM.on('click', function(e) {
        console.log('Lon, Lat: ' + e.coordinate)
    })
}

// Watercolor Map function
function initWatercolor() {
    var mapStamen = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            projection: 'EPSG:3857',
            // maxZoom: 10,
            zoom: 3
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'watercolor'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'terrain-labels'
                })
            })
        ]
    })
}

// Terrain Map function
function initTerrain() {
    var mapTerrain = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            projection: 'EPSG:3857',
            // maxZoom: 10,
            zoom: 3
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.Stamen({
                    layer: 'terrain'
                })
            })
        ]
    })
}

// Google Map function
function initGoogle() {
    var mapGoogle = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: [0, 0],
            zoom: 2,
        }),
        layers: [
            new ol.layer.Tile({
                title: "GoogleTerrain&Roads",
                source: new ol.source.TileImage({ 
                    url: 'http://mt1.google.com/vt/lyrs=m&hl=ru&x={x}&y={y}&z={z}'
                }),
            }),
        ]
    });
}