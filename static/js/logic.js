var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url, function(data) {
    createFeatures(data.features);
});
function choseColor(mag) {
  if (mag > 5) {
    return "#800026";
  }
  else if (mag > 4) {
    return "#BD0026";
  }
  else if (mag > 3) {
    return "#E31A1C";
  }
  else if (mag > 2) {
    return "#FC4E2A";
  }
  else if (mag > 1) {
    return "#FD8D3C";
  }
  else {
    return "#FEB24C";
  }
}

function createFeatures(earthquakeData) {
  console.log(earthquakeData);

  function onEachFeature(feature, layer) {
      
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    function creatStyle(feature, layer) {
      return {
        radius: feature.properties.mag * 5,
        fillColor: choseColor(feature.properties.mag),
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    }
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
        onEachFeature: onEachFeature,
        style : creatStyle
    })
    ;

    createMap(earthquakes);
    
};

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    var baseMaps = {
        "Street Map": streetmap,
      };
    
      // Create overlay object to hold our overlay layer
      var overlayMaps = {
        Earthquakes: earthquakes
      };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load
      var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
      });
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
  
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + choseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap)  };
