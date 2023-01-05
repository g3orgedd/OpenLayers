/***
 * Library Import
 */

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileImage from 'ol/source/TileImage';
import Geolocation from 'ol/Geolocation';
import BingMaps from 'ol/source/BingMaps';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import TileDebug from 'ol/source/TileDebug';
import Link from 'ol/interaction/Link';
import Geometry from 'ol/geom/Geometry';
import MousePosition from 'ol/control/MousePosition';

import { createStringXY } from 'ol/coordinate';
import { Vector as VectorSource } from 'ol/source';
import { 
  Vector as VectorLayer, 
  VectorImage as VectorImageLayer,
} from 'ol/layer';

import { GPX, GeoJSON, IGC, KML, TopoJSON, } from 'ol/format';

import { 
  Draw, Snap, Modify, 
  Select, Translate,
  DragAndDrop, DragRotateAndZoom, 
  defaults as defaultInteractions,
} from 'ol/interaction';

import {
  Tile as TileLayer, Group as LayerGroup,
} from 'ol/layer';

import { 
  ZoomToExtent, OverviewMap, ZoomSlider, FullScreen, ScaleLine, 
  defaults as defaultControls,
} from 'ol/control';
import { fromLonLat, transform, } from 'ol/proj';

/***
 * Program
 */

// Data formats
const dragAndDropInteraction = new DragAndDrop({
  formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON],
});

const source = new VectorSource({wrapX: false});
// Create a vector variable to interact with later
const vector = new VectorLayer({
  source: source,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#3333ff',
    'stroke-width': 2,
    'circle-radius': 6,
    'circle-fill-color': '#ff3333',
  }
});

const overviewMapControl = new OverviewMap({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
});

// Adds selection feature
const select = new Select();

// Adds translate feature
const translate = new Translate({
  features: select.getFeatures(),
});

// Adds mouse position coords on the map
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(7),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  // className: 'custom-mouse-position',
  // target: document.getElementById('mouse-position'),
});

// Create map variable to init ol
var map = new Map({
  controls: defaultControls().extend([
    mousePositionControl,
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
  interactions: defaultInteractions().extend([
    new DragRotateAndZoom(),
    dragAndDropInteraction,
    select,
    translate,
  ]),
  // layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [4193730.99826, 7505925.25007],
    zoom: 7,
    projection: 'EPSG:3857',
  }),
});

const typeSelect = document.getElementById('geom_type');

// Adds modify interaction
const modify = new Modify({source: source});
map.addInteraction(modify);

// Adds map state sync with url
// map.addInteraction(new Link());

let draw, snap; // Global to remove it later

function addInteraction() {
  const value = typeSelect.value;
  if (value !== 'None') {
    draw = new Draw({
      source: source,
      type: value,
    });
    map.addInteraction(draw);
    snap = new Snap({
      source: source
    });
    map.addInteraction(snap);
  }
};

// Drag&Drop function
dragAndDropInteraction.on('addfeatures', function (event) {
  const vectorSource = new VectorSource({
    features: event.features,
  });
  map.addLayer(
    new VectorImageLayer({
      source: vectorSource,
    })
  );
  map.getView().fit(vectorSource.getExtent());
});

// Onchange function
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteraction();
};

// addInteraction();

// Undo function
document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});

// OSM layer
const OSMap = new TileLayer({
  title: 'OSMStandart',
  source: new OSM(),
});

// Google layer
const GoogleMap = new TileLayer({
  title: "GoogleTerrainRoads",
  source: new TileImage({ 
    url: 'http://mt1.google.com/vt/lyrs=m&hl=ru&x={x}&y={y}&z={z}'
  }),
  visible: false
});

// Bing layer
const BingMapL = new TileLayer({
  title: "BingMapLayer",
  source: new BingMaps({ 
    key: 'AsraMovwJhfFMIfvvB7hVPQyOwe23_5n79AE8T-Y2w_92UJ6qAA4lEH7Qs3DQ2v5',
    imagerySet: 'RoadOnDemand',
  }),
  visible: false
});

// A group of layers to change layers among themselves
const layerGroup = new LayerGroup({
  layers: [
    OSMap,
    GoogleMap,
    BingMapL,
  ]
});

// Adds Layer group
map.addLayer(layerGroup);
// Adds Vector layer
map.addLayer(vector);

const baseLayerElements = document.querySelectorAll('.btn-group-vertical > input[type=radio]')
for(let baseLayerElement of baseLayerElements) {
  baseLayerElement.addEventListener('change', function() {
    let baseLayerValue = this.value;
    layerGroup.getLayers().forEach(
      function(element) {
        let baseLayerTitle = element.get('title');
        element.setVisible(baseLayerTitle === baseLayerValue);
    })
  })
};

// Enable Geolocation
var geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
});

window.onload = function() {
  geolocation.setTracking(this);
}

// MyLocation function
document.getElementById('myLocation').addEventListener('click', function() {
  map.setView(
    new View({
      center: fromLonLat(geolocation.getPosition()),
      zoom: 19
    })
  );
  console.log(geolocation.getPosition());
});

/*
map.on('click', function(e) {
  // let coordinates = Array(1).fill(transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));
  // let coordinates = Array(1).fill(e.coordinate);

  // marksCoords.push(coordinates)
  // console.log(marksCoords)

  document.getElementById('lon').innerText = 'LON: ' + coordinates[0][0].toFixed(10);
  document.getElementById('lat').innerText = 'LAT: ' + coordinates[0][1].toFixed(10);
});
*/

// Graticule function
const graticule = new Graticule({
  // the style to use for the lines, optional.
  strokeStyle: new Stroke({
    color: 'rgba(255, 120, 0, 0.9)',
    width: 2,
    lineDash: [0.5, 3],
  }),
  showLabels: true,
  visible: false,
  wrapX: false,
});

// Add Graticule layer
map.addLayer(graticule);

const showGraticuleCheckbox = document.getElementById('inlineCheckbox3');

showGraticuleCheckbox.addEventListener('change', function() {
  graticule.setVisible(showGraticuleCheckbox.checked);
});

// Debug layer
const debugLayer = new TileLayer({
  source: new TileDebug({
    tileGrid: new OSM().getTileGrid(),
    projection: new OSM().getProjection(),
  }),
  visible: false,
});

// Adds debugLayer layer
map.addLayer(debugLayer);

const showTilesCheckbox = document.getElementById('inlineCheckbox2');

showTilesCheckbox.addEventListener('change', function() {
  debugLayer.setVisible(showTilesCheckbox.checked);
});

// Changes projection cooddinates on the map
const projectionSelect = document.getElementById('proj_type');
projectionSelect.addEventListener('change', function (event) {
  mousePositionControl.setProjection(event.target.value);
});