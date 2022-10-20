// не работает 
window.onload = initMap;

function init() {
  const map = new ol.Map({
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [0, 0],
      zoom: 2,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'https://ahocevar.com/geoserver/wms',
          params: {
            'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
            'TILED': true,
          },
        }),
      }),
    ]
  });
}

function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: -28, lng: 137 },
  });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson(
    "https://storage.googleapis.com/mapsdevsite/json/google.json"
  );
}

// window.initMap = initMap;