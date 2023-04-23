import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';
import { Draw, Modify }from 'ol/interaction';

import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

// ============================================================================================

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

// ============================================================================================

const source1 = new VectorSource();
const vector1 = new VectorLayer({
    source: source1,
});

const source2 = new VectorSource();
const vector2 = new VectorLayer({
    source: source2,
});

// ============================================================================================

const typeSelect = document.getElementById('type');

var draw, modify; // global so we can remove it later
function addInteraction(vector) {
    const value = typeSelect.value;
    if (value !== 'None') {
        draw = new Draw({
            source: vector,
            type: typeSelect.value,
        });
        map.addInteraction(draw);

        modify = new Modify({
            source: vector,
        });
        map.addInteraction(modify);
    }
}

function removeInteraction() {
    map.removeInteraction(draw);
}

// ============================================================================================

$('.set1').click(function() {
    removeInteraction(source2);

    map.addLayer(vector1);
    map.removeLayer(vector2);

    addInteraction(source1);
});

$('.set2').click(function() {
    removeInteraction(source1);
    
    map.addLayer(vector2);
    map.removeLayer(vector1);

    addInteraction(source2);
});

// ============================================================================================

var selectID = document.getElementById('vector_layers');

var i = 0;
$(".create").click(function() {
    // console.log(markerGroup.getLayers());
    var vectorLayers = [];
    var name = 'vectorLayer' + i;

    name = new VectorLayer({
        source: new VectorSource({
            url: './geodata/sample/example.geojson',
            format: VectorLayer,
        }),
    });

    // markerGroup.getLayers().array_.push(name);
    // name.setVisible(true);
    // map.addLayer(name);

    vectorLayers.push(name);

    selectID.options[selectID.length] = new Option('Layer ' + selectID.length, name);
    // map.addLayer(name);

    console.log(name);
    i++;
});