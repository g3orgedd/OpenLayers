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

const source1 = new VectorSource({wrapX: false});
const vector1 = new VectorLayer({
    title: 'vector1',
    source: new VectorSource({
        url: './geodata/sample/example.geojson',
        format: new GeoJSON(),
    }),
    visible: false
});

const source2 = new VectorSource({wrapX: false});
const vector2 = new VectorLayer({
    title: 'vector2',
    source: new VectorSource({
        url: './geodata/sample/sample.geojson',
        format: new GeoJSON(),
    }),
    visible: false
});

const source3 = new VectorSource({wrapX: false});
const vector3 = new VectorLayer({
    title: 'vector3',
    source: new VectorSource({
        url: './geodata/sample/map.geojson',
        format: new GeoJSON(),
    }),
    visible: false
});

var vectors = new Array();
vectors.push(vector1.get('title'), vector2.get('title'), vector3.get('title'));

map.addLayer(vector1);
map.addLayer(vector2);
map.addLayer(vector3);

const baseLayerElements1 = document.querySelectorAll('.layer-group-2 > .btn-group-vertical > input[type=checkbox]')
for(let element of baseLayerElements1) {
    // values.push(element.value);
    element.addEventListener('change', (event) => {
        // let vectorLayerValue = event.target.value;
        // console.log(vectorLayerValue);

        // console.log(event.target);
        if (event.target.checked == true) {
            vector1.setVisible(true);
        } else {
            vector1.setVisible(false);
        }
        
    // layerGroup.getLayers().forEach(
    //   function(element) {
    //     let baseLayerTitle = element.get('title');
    //     element.setVisible(baseLayerTitle === baseLayerValue);
    // })
  })
};

var list = ['vector1', 'vector2', 'vector3'];

$(document).ready(function() {
    $('#submit1').click(function() {
        for (var value of vectors) {
          $('.check-form-1')
            .append(`
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${value}" id="${value}">
                    <label class="form-check-label for="${value}">${value}</label>
                </div>
            `);
        }
    })
});

document.querySelector('.check-form-1').addEventListener('change', (event) => {
    map.getLayers().forEach(function(e) {
        if (event.target.value == e.get('title')) {
            e.setVisible(event.target.checked);
        }
    });
});


