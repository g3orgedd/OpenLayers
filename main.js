window.onload = init;

function init() {
    const map = new ol.Map({
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

    // Get coordinates on map - получаем координаты по клику
    map.on('click', function(e) {
        console.log(e.coordinate)
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

    // SKFO Layer - Северо-Кавказский федеральный округ

    // North Osetia Geo Data
    const NorthOsetiaGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/SKFO/North_Osetia_Republic.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'SKFO'
    })

    map.addLayer(NorthOsetiaGeoJSON);
}