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
// import Stroke from 'ol/style/Stroke';
import TileDebug from 'ol/source/TileDebug';
import MousePosition from 'ol/control/MousePosition';

import { createStringXY } from 'ol/coordinate';
import { Vector as VectorSource } from 'ol/source';
import { 
  Vector as VectorLayer, 
  VectorImage as VectorImageLayer,
  Tile as TileLayer, Group as LayerGroup,
} from 'ol/layer';

import { GPX, GeoJSON, IGC, KML, TopoJSON, } from 'ol/format';

import { getArea, getLength } from 'ol/sphere';

import { 
  Draw, Snap, Modify, 
  Select, Translate,
  DragAndDrop, DragRotateAndZoom, 
  defaults as defaultInteractions,
} from 'ol/interaction';

import { 
  ZoomToExtent, OverviewMap, ZoomSlider, FullScreen, ScaleLine, 
  defaults as defaultControls,
} from 'ol/control';

import { LineString, Point } from 'ol/geom';

import { 
  getPointResolution,
  fromLonLat, 
  transform, 
  get as getProjection
} from 'ol/proj';

import {
  Circle as CircleStyle,
  RegularShape,
  Stroke,
  Style,
  Fill,
  Text,
} from 'ol/style';

/***
 * Program
 */

// Data formats
const dragAndDropInteraction = new DragAndDrop({
  formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON],
});

const vSource = new VectorSource({wrapX: false});
// Create a vector variable to interact with later
const vector = new VectorLayer({
  source: vSource,
  // style: {
  //   'fill-color': 'rgba(255, 255, 255, 0.2)',
  //   'stroke-color': '#3333ff',
  //   'stroke-width': 2,
  //   'circle-radius': 6,
  //   'circle-fill-color': '#ff3333',
  // }
  style: function (feature) {
    return styleFunction(feature, showSegments.checked, !(showLengthArea.checked));
  },
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
  projection: 'EPSG:3857',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  // className: 'custom-mouse-position',
  // target: document.getElementById('mouse-position'),
});

// Adds a Measurement function

const measureTypeSelect = document.getElementById('measure_type');
const showSegments = document.getElementById('showSegmentLengths');
const showLengthArea = document.getElementById('showLengthArea');
const clearPrevious = document.getElementById('clearPrevMeasure');

const style = new Style({

  // fill-color': 'rgba(255, 255, 255, 0.2)',
  // 'stroke-color': '#3333ff',
  // 'stroke-width': 2,
  // 'circle-radius': 6,
  // 'circle-fill-color': '#ff3333',

  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2.5,
  }),
  image: new CircleStyle({
    radius: 5.9,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.3)',
    }),
    fill: new Fill({
      color: '#ff3333',
    }),
  }),
});

const labelStyle = new Style({
  text: new Text({
    font: '15px Roboto, sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [4, 5, 4, 5],
    textBaseline: 'bottom',
  }),
});

const segmentStyle = new Style({
  text: new Text({
    font: '13px Roboto, sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [3, 4, 3, 4],
    textBaseline: 'bottom',
    offsetY: -7,
  }),
});

const segmentStyles = [segmentStyle];

const formatLength = function (line) {
  const length = getLength(line);
  let output;

  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};

const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;

  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
  } else {
    output = Math.round(area * 100) / 100 + ' m\xB2';
  }

  return output;
};

// const raster = new TileLayer({
//   source: new OSM(),
// });

const source = new VectorSource();

const modifyMeasure = new Modify({source: source});


function styleFunction(feature, segments, measureDrawType) {
  const styles = [style];
  const geometry = feature.getGeometry();
  const type = geometry.getType();

  let point, label, line;

  if (!measureDrawType || measureDrawType === type) {
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new LineString(geometry.getCoordinates()[0]);
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }

  if (segments && line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);

      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }

      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      
      count++;
    });
  }

  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }
  // if (
  //   tip &&
  //   type === 'Point' &&
  //   !modify.getOverlay().getSource().getFeatures().length
  // ) {
  //   tipPoint = geometry;
  //   tipStyle.getText().setText(tip);
  //   styles.push(tipStyle);
  // }
  return styles;
}

// const measureVector = new VectorLayer({
//   source: source,
//   style: function (feature) {
//     return styleFunction(feature, showSegments.checked);
//   },
// });

// Create map variable to init ol
var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    // raster, 
    // measureVector
  ],
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

const geomTypeSelect = document.getElementById('geom_type');

// Adds modify interaction
const modify = new Modify({
  source: vSource,
});
map.addInteraction(modify);

// Adds map state sync with url
// map.addInteraction(new Link());

let draw, snap, drawMeasure; // Global to remove it later

function addInteraction() {
  const value = geomTypeSelect.value;
  if (value !== 'None') {
    if (value == 'LineString' || value == 'Polygon') {
      draw = new Draw({
        source: vSource,
        type: value,
        style: function (feature) {
          return styleFunction(feature, showSegments.checked, geomTypeSelect);
        },
      });
    } else {
      draw = new Draw({
        source: vSource,
        type: value,
      });
    }
    let i = 0;
    draw.on('drawend', function(e) {
      var customName = prompt('Введите название объекта');
      
      if(customName == null) {
        customName = value + (i++);
      }
      // e.feature.setId(i);
      let featureID = e.feature.ol_uid;
      e.feature.setProperties({
        'id': featureID,
        // 'name': value + featureID,
        'name': customName,
        'description': value,
      })
      console.log(e.feature, e.feature.getProperties());
    });

    map.addInteraction(draw);
    snap = new Snap({
      source: vSource
    });
    map.addInteraction(snap);
  }

  // const measureDrawType = measureTypeSelect.value;
  // if (drawMeasure != 'None') {
  //   drawMeasure = new Draw({
  //     source: source,
  //     type: measureDrawType,
  //     style: function (feature) {
  //       return styleFunction(feature, showSegments.checked, measureDrawType);
  //     },
  //   });
  
  //   // draw.on('drawstart', function () {
  //   //   if (clearPrevious.checked) {
  //   //     source.clear();
  //   //   }
  //   //   modify.setActive(false);
  //   // });
  
  //   // draw.on('drawend', function () {
  //   //   modify.setActive(true);
  //   // });
  
  //   modifyMeasure.setActive(true);
  //   map.addInteraction(drawMeasure);
  // }
};

// measureTypeSelect.onchange = function () {
//   map.removeInteraction(drawMeasure);
//   addInteraction();
// };

addInteraction();

showSegments.onchange = function () {
  vector.changed();
  draw.getOverlay().changed();
};

showLengthArea.onchange = function () {
  vector.changed();
  draw.getOverlay.changed();
}

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
geomTypeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteraction();
};

// addInteraction();

// Undo function
document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});

// Delete function
document.getElementById('delete').addEventListener('click', function () {
  map.removeInteraction(draw);
  addInteraction();
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

const baseLayerElements = document.querySelectorAll('.btn-group > input[type=radio]')
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

// Adds Graticule layer
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

// Adds opacity change function
const opacityInput = document.getElementById('opacity-input');
const opacityOutput = document.getElementById('opacity-output');

function opacityUpdate() {
  const opacity = parseFloat(opacityInput.value);
  layerGroup.setOpacity(opacity);
  opacityOutput.innerText = opacity.toFixed(2);
}
opacityInput.addEventListener('input', opacityUpdate);
opacityUpdate();

// The function below allows you to change the projection of the map
const viewProjSelect = document.getElementById('proj_type');

function onChangeProjection() {
  const currentView = map.getView();
  const currentProjection = currentView.getProjection();
  const newProjection = getProjection(viewProjSelect.value);
  const currentResolution = currentView.getResolution();
  const currentCenter = currentView.getCenter();
  const currentRotation = currentView.getRotation();
  const newCenter = transform(currentCenter, currentProjection, newProjection);
  const currentMPU = currentProjection.getMetersPerUnit();
  const newMPU = newProjection.getMetersPerUnit();

  const currentPointResolution = getPointResolution(
      currentProjection, 1 / currentMPU, currentCenter, 'm'
    ) * currentMPU;

  const newPointResolution = getPointResolution(
      newProjection, 1 / newMPU, newCenter, 'm'
    ) * newMPU;

  const newResolution = (currentResolution * currentPointResolution) / newPointResolution;
    
  const newView = new View({
    center: newCenter,
    resolution: newResolution,
    rotation: currentRotation,
    projection: newProjection,
  });
  map.setView(newView);
}
viewProjSelect.addEventListener('change', onChangeProjection);

// Export map as PDF function

const exportButton = document.getElementById('save_pdf');

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

exportButton.addEventListener('click', function () {
    exportButton.disabled = true;
    document.body.style.cursor = 'progress';

    const format = document.getElementById('page_size').value;
    const resolution = document.getElementById('page_res').value;

    const dim = dims[format];
    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);
    const size = map.getSize();
    const viewResolution = map.getView().getResolution();

    map.once('rendercomplete', function () {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            const transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            const matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);
      const pdf = new jspdf.jsPDF('landscape', undefined, format);
      pdf.addImage(
        mapCanvas.toDataURL('image/jpeg'),
        'JPEG',
        0,
        0,
        dim[0],
        dim[1]
      );
      
      pdf.save('map.pdf');
      // Reset original map size
      map.setSize(size);
      map.getView().setResolution(viewResolution);
      exportButton.disabled = false;
      document.body.style.cursor = 'auto';
    });

    // Set print size
    const printSize = [width, height];
    map.setSize(printSize);
    const scaling = Math.min(width / size[0], height / size[1]);
    map.getView().setResolution(viewResolution / scaling);
  },
  false
);

// Export geoJson function 

$(".exportJson").click(function() {
  var json = new ol.format.GeoJSON().writeFeaturesObject(vector.getSource().getFeatures(), { 
    dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
  });
  // console.log(json);

  // var features = vector.getSource().getFeatures();
  // console.log(features);

  
  class JavascriptDataDownloader {

    constructor(data = {json}) {
        this.data = data;
    }

    download (type_of = "text/plain", filename= "data.geojson") {
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.data, null, 2)], {
            type: type_of
        }));

        a.setAttribute("download", filename);
        body.appendChild(a);

        a.click();
        body.removeChild(a);
    }
  } 
  
  new JavascriptDataDownloader(json).download();
  
});


// var data = [[
//   7356799.446749384,
//   9193160.203377454
// ],
// [
//   7400958.011798843,
//   6024783.161078758
// ],
// [
//   14366971.648351029,
//   6035822.802341122
// ],
// [
//   14311773.442039203,
//   9193160.203377454
// ],
// [
//   7356799.446749384,
//   9193160.203377454
// ]];

// var polygon = new ol.Feature({
//   geometry: new ol.geom.Polygon([data]),
// });

// vSource.addFeature(polygon);