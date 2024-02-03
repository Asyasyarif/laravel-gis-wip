
var map, layer
var initLatLng = [];
var basemap_kecamatan = [];
var basemap_kelurahan = [];
var defineZoom;
var initLat = -6.204
var initLng = 110.6049
var initZoom = 7.4
var last_id_kab = 0;
var last_id_kec = 0;
var typeLayer = 'kab'
var idLayer = ''
var titik = [];

var newStyle = {
    color: '#F99417',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
};

function init() {
    initialize_basemap()
    initialize_kabupaten()

    map.on("moveend", function () {
        if(map.getZoom() < 11  && status_basemap == 'kecamatan'){
            removeOverlay('basemap_kabupaten');
            removeOverlay('basemap_kecamatan');
            removeOverlay('basemap_kelurahan');

            initialize_kabupaten();

            typeLayer = 'kab';
            idLayer = '';
        }else if(map.getZoom() < 13  && status_basemap == 'kelurahan'){
            removeOverlay('basemap_kabupaten');
            removeOverlay('basemap_kecamatan');
            removeOverlay('basemap_kelurahan');
            initialize_kecamatan(last_id_kab);
            typeLayer = 'kec';
            idLayer = last_id_kab;
        }
    })
}

function initialize_basemap() {
    var t = parseFloat(initLat);
    var g = parseFloat(initLng)
    initLatLng = [t, g];
    defineZoom = parseInt(initZoom);
    
    map = L.map('map', {
        zoomControl: false
    }).setView(initLatLng, defineZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 8,
        maxZoom: 14
    }).addTo(map);

    map.addControl( L.control.zoom({position: 'bottomright'}) )
}

function initialize_kabupaten() {
    $.LoadingOverlay("show");

    removeOverlay('basemap_kecamatan');
    removeOverlay('basemap_kabupaten');

    // tabs.pop();
    status_basemap = 'kabupaten';

    $.getJSON('geojson/kabupaten', function (geojson) {
        var polygon = L.geoJson(geojson, {
            onEachFeature: function (feature, layer) {
                prop = feature.properties;
                layer.bindTooltip( prop.tipe + ' ' + prop.kabupaten, {
                    sticky: true,
                    direction: 'auto'
                });

                layer.setStyle(style(prop.color));

                var id_kab = prop.id_kab;

                // adding infopeta
                $("#info-point-map").html('');
                $("#info-point-map").addClass('d-none');

                layer.on('mouseover', function () {
                    layer.setStyle(newStyle)
                })

                layer.on('mouseout', function () {
                    layer.setStyle(style(prop.color));
                })

                layer.on('click', function (e) {
                    removeMarker();

                    map.setView([e.latlng.lat - 0.001, e.latlng.lng + 0.01], 11);
                    initialize_kecamatan(id_kab);

                    idKab = id_kab;
                    typeLayer = 'kec';
                    idLayer = id_kab;

                    last_id_kab = id_kab;
                });
            }
        }).addTo(map);

        basemap_kecamatan.push(polygon);

        // tabs.push(query);

        $.LoadingOverlay("hide", {
            fade: [3000]
        });
    });
}

function initialize_kecamatan(id_kab = '') {
    $.LoadingOverlay("show");
    removeOverlay('basemap_kelurahan');
    removeOverlay('basemap_kecamatan');

    // tabs.pop();
    // $.LoadingOverlay("hide", {
    //     fade: [3000]
    // });

    status_basemap = 'kecamatan';
   
    $.getJSON('geojson/kabupaten/'+id_kab+'/kecamatan', function (geojson) {
        console.log(geojson);
        var polygon = L.geoJson(geojson, {
            onEachFeature: function (feature, layer) {
                prop = feature.properties;
                layer.bindTooltip("KECAMATAN " + prop.kecamatan, {
                    sticky: true,
                    direction: 'auto'
                });

                layer.setStyle(style(prop.color));

                var id_kab = prop.id_kab;
                var id_kec = prop.id_kec;

                // adding infopeta
                $("#info-point-map").html(prop.infopeta);
                $("#info-point-map").removeClass('d-none');
              
                layer.on('mouseover', function () {
                    layer.setStyle(newStyle)
                })

                layer.on('mouseout', function () {
                    layer.setStyle(style(prop.color));
                })

                layer.on('click', function (e) {
                    removeMarker();
                    typeLayer = 'kel';
                    idLayer = id_kec;
                    map.setView([e.latlng.lat - 0.001, e.latlng.lng + 0.01], 13);
                    initialize_kelurahan(id_kab, id_kec);
                    last_id_kab = id_kab;
                    last_id_kec = id_kec;
                });
            }
        }).addTo(map);
        basemap_kecamatan.push(polygon);
   
    });

    $.LoadingOverlay("hide", {
        fade: [3000]
    });
}

function initialize_kelurahan(id_kab = '', id_kec = '') {
    $.LoadingOverlay("show");

    removeOverlay('basemap_kelurahan');
    removeOverlay('basemap_kecamatan');
    removeOverlay('basemap_kabupaten');

    // tabs.pop();

    status_basemap = 'kelurahan';
    $.getJSON('geojson/kabupaten/'+ id_kab +'/kecamatan/' + id_kec + '/kelurahan' , function (geojson) {

        var polygon = L.geoJson(geojson, {
            onEachFeature: function (feature, layer) {
                prop = feature.properties;
                console.log("aaaaa")
                // layer.bindPopup('<div class="marker_info none" id="marker_info">' +
                //     '<div class="info" id="info">' +
                //     '<img src="' + '/images/logo/logo-polda-jatim.jpg" class="logotype" alt="Polda Jatim"/>' +
                //     '<h2> DESA ' + prop.kelurahan + '<span></span></h2>' +
                //     '<span>Nama Desa: <strong>' + prop.kelurahan + '</strong></span>' +
                //     '<span class="arrow"></span>' +
                //     '</div>' +
                //     '</div>'
                // );

                layer.on('mouseover', function () {
                    layer.setStyle(newStyle)
                })

                layer.on('mouseout', function () {
                    layer.setStyle(style(prop.color));
                })

                layer.bindTooltip("DESA " + prop.kelurahan, {
                    sticky: true,
                    direction: 'auto'
                });

                layer.setStyle(style(prop.color));

                var kec = prop.id_kec;

                // adding infopeta
                $("#info-point-map").html(prop.infopeta);
                $("#info-point-map").removeClass('d-none');

                layer.on('click', function (e) {
                    map.fitBounds(e.target.getBounds());
                });
            }
        }).addTo(map);

        basemap_kecamatan.push(polygon);

        // tabs.push(id_kab);

        // createMarkers('positif', '', id_kec);

        $.LoadingOverlay("hide", {
            fade: [3000]
        });
    });
}

function removeOverlay(overlay) {
    if (overlay == "basemap_kecamatan") {
        if (basemap_kecamatan) {
            for (i in basemap_kecamatan) {
                map.removeLayer(basemap_kecamatan[i]);
            }
            basemap_kecamatan.length = 0;
        }
    } else if (overlay == "basemap_kelurahan") {
        if (basemap_kelurahan) {
            for (i in basemap_kelurahan) {
                map.removeLayer(basemap_kelurahan[i]);
            }
            basemap_kelurahan.length = 0;
        }
    }
}

function style(color) {
    var hex;
    if(color == ''){
        hex = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }else{
        hex = color;
    }

    return {
        color: '#333',
        weight: 1,
        fillColor: hex,
        fillOpacity: 0.1
    };
}

function removeMarker() {
    if (titik) {
        for (i in titik) {
            map.removeLayer(titik[i]);
        }
        titik.length = 0;
    }
}