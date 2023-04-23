import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';
import { Draw, Modify }from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON.js';

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

// const source1 = new VectorSource();
// const vector1 = new VectorLayer({
//     source: source1,
// });

// const source2 = new VectorSource();
// const vector2 = new VectorLayer({
//     source: source2,
// });

// ============================================================================================

const typeSelect = document.getElementById('geom_type');
// const value = typeSelect.value;

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
    typeSelect.onchange = function () {
        map.removeInteraction(draw);
        // map.removeInteraction(modify);
        addInteraction(vector);
    };
}

function removeInteraction() {
    map.removeInteraction(draw);
    // map.removeInteraction(modify);
}
// ============================================================================================
/*
var selectID = document.getElementById('vector_layers');

var i = 0;
$(".create1").click(function() {
    // console.log(markerGroup.getLayers());
    var vectorLayers = [];
    var name = 'vectorLayer' + i;

    name = new VectorLayer({
        source: new VectorSource({
            url: './geodata/sample/example.geojson',
            format: new GeoJSON(),
        }),
    });

    // markerGroup.getLayers().array_.push(name);
    // name.setVisible(true);
    // map.addLayer(name);

    vectorLayers.push(name);

    // selectID.options[selectID.length] = new Option('Layer ' + selectID.length, name);
    // map.addLayer(name);

    console.log(name);
    i++;
});
*/
// ============================================================================================

// var selectLength = $('#vector_layers > option').length - 1;
var selectID = document.getElementById('vector_layers');

$(".create").click(function() {
    let newSelectOption = new Option('Слой ' + selectID.length, selectID.length - 1);
    selectID.options[selectID.length] = newSelectOption;
    
    console.log(newSelectOption.value);
});

// ============================================================================================

var values = new Array();

$("#vector_layers option").each(function() {
    if($(this).val() !== '') {
        values.push($(this).val())
    }
});

console.log(values);

var sources = new Array();
var vectors = new Array();

document.getElementById('vector_layers').addEventListener('change', function() {
    for (let index = 0; index < values.length-1; index++) {
        var s = new VectorSource();
        var v = new VectorLayer({
            source: s
        })
    
        sources.push(s);
        vectors.push(v);
    }
});

// console.log(sources);
// console.log(vectors);

// ============================================================================================

document.getElementById('vector_layers').addEventListener('change', function() {
    if (this.value !== 'layer') {
        for (let index = 0; index < sources.length; index++) {
            if (index != this.value) {
                map.removeLayer(vectors[index]);
                removeInteraction(sources[index]);
            }
        }

        addInteraction(sources[this.value]);
        map.addLayer(vectors[this.value]);
    }

    // console.log('You selected: ', this.value);
});

// ============================================================================================

$(document).ready(function() {
    $('#delete_layer').click(function() {
        // get the selected option and remove it from the DOM
        $('#vector_layers option:selected').remove();
    });
});