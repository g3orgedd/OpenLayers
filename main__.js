import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileJSON from 'ol/source/TileJSON.js';
import View from 'ol/View.js';
import {Group as LayerGroup, Tile as TileLayer} from 'ol/layer.js';
import {fromLonLat} from 'ol/proj.js';
import TileImage from 'ol/source/TileImage';
import GeoJSON from 'ol/format/GeoJSON.js';
import Draw from 'ol/interaction/Draw.js';

import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';


const source1 = new VectorSource({wrapX: false});
const vector1 = new VectorLayer({
    source: source1,
});

const source2 = new VectorSource({wrapX: false});
const vector2 = new VectorLayer({
    source: source2,
});

var markerGroup = new LayerGroup({
    layers: [],
});

const raster = new TileLayer({
    source: new OSM(),
});

const map = new Map({
    layers: [
        raster,
    ],
    target: 'map',
    view: new View({
        center: fromLonLat([0, 0]),
        zoom: 1,
     }),
});

var selectID = document.getElementById('layers');

// map.addLayer(markerGroup);

var i = 0;
$(".save").click(function() {
    // console.log(markerGroup.getLayers());
    var name = 'vectorLayer' + i;

    name = new VectorLayer({
        source: new VectorSource({
            url: './geodata/sample/example.geojson',
            format: new GeoJSON(),
        }),
    });

    // markerGroup.getLayers().array_.push(name);
    // name.setVisible(true);
    map.addLayer(name);

    selectID.options[selectID.length] = new Option('Layer ' + selectID.length, name);
    // map.addLayer(name);

    console.log(i);
    i++;
});

const typeSelect = document.getElementById('type');


$('.log-lg').click(function() {
    // console.log(markerGroup.getLayers());
    console.log(map.getLayers());
});

// var sourceDraw1 = source1;
// var sourceDraw2 = source2;



$('.set1').click(function() {
    map.addLayer(vector1);
    map.removeLayer(vector2);
});

$('.set2').click(function() {
    map.addLayer(vector2);
    map.removeLayer(vector1);
});

// $("#twoLayers").change(function() {
//     var v = $( "#twoLayers option:selected" ).val();
//     console.log(v);
// });

const selectt = document.querySelector('#twoLayers');

// var ss = source1;

selectt.options[0] = new Option('set1', source1);
selectt.options[1] = new Option('set2', source2);


// ss = selectt.addEventListener("change", (event) => {
//     var result = event.target.value;
//     console.log(result);

//     return result;
// });

var draw; // global so we can remove it later
function addInteraction() {
    const value = typeSelect.value;
    if (value !== 'None') {
        draw = new Draw({
            source: source1,
            type: typeSelect.value,
        });
    map.addInteraction(draw);
    }
}
addInteraction();