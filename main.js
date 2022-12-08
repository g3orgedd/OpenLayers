/***
 * Library Import
 */

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileImage from 'ol/source/TileImage';
import { Draw, Snap, Modify } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import {
  Tile as TileLayer,
  Group as LayerGroup
 } from 'ol/layer';
import View from 'ol/View';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import { 
  ZoomToExtent,
  OverviewMap,
  ZoomSlider,
  FullScreen,
  ScaleLine, 
  defaults as defaultControls
} from 'ol/control';

/***
 * Program
 */

const source = new VectorSource({wrapX: false});
// Create a vector variable to interact with later
const vector = new VectorLayer({
  source: source,
});

const overviewMapControl = new OverviewMap({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
});

// Create map variable to init ol
const map = new Map({
  controls: defaultControls().extend([
    overviewMapControl,
    new ScaleLine(),
    new FullScreen(),
    new ZoomSlider(),
    new ZoomToExtent({
      extent: [
        4895700.028417149, 5331463.936836658, 
        5050045.865083950, 5300463.201395324,
      ],
    }),
  ]),
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  // layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [500000, 6000000],
    zoom: 7,
  }),
});

const typeSelect = document.getElementById('type');

const modify = new Modify({source: source});
map.addInteraction(modify);

let draw, snap; // Global to remove it later

function addInteraction() {
  const value = typeSelect.value;
  if (value !== 'None') {
    draw = new Draw({
      source: source,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new Snap({
      source: source
    });
    map.addInteraction(snap);
  }
}

// Onchange function
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteraction();
};

addInteraction();

// OSM Layer
const OSMap = new TileLayer({
  title: 'OSMStandart',
  source: new OSM(),
})

// Google Layer
const GoogleMap = new TileLayer({
  title: "GoogleTerrainRoads",
  source: new TileImage({ 
    url: 'http://mt1.google.com/vt/lyrs=m&hl=ru&x={x}&y={y}&z={z}'
  }),
  visible: false
})

// A group of layers to change layers among themselves
const layerGroup = new LayerGroup({
  layers: [
    OSMap,
    GoogleMap,
  ]
})

// Add Layer Group
map.addLayer(layerGroup)
// Add Vector Layer
map.addLayer(vector)

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