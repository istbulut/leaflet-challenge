//Part 1
// Base map of map.
let street= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })


// Map object with options.
let map = L.map("map", {
  center: [39.113014,-105.358887],
  zoom: 5
});


// Adding base map to the map.
street.addTo(map);

// Retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson").then(function (data) {

  //Function for data styling for each of the earthquakes
   function markerStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: radiusSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // color function for the markerstyle, based on the debt of the earthquake.
    function chooseColor(depth) {
  
      if (depth > 90) return "#150202";
      else if (depth > 70) return "#5c0909";
      else if (depth > 50) return "#c71414";
      else if (depth > 30) return "#ea2c2c";
      else if (depth > 10) return "#f17373";
      else return "#facdcd";
    }
       

  // Size function for the markerStyle, the radius based on eartquake's magnitude.
    function radiusSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 5;
  }


  // adding GeoJSON layer, for each future on the map functions return with circle marker and bind popUp
  L.geoJson(data, {
    // circle marker
    pointToLayer: function (feature, location) {
      return L.circleMarker(location);
    },
    
    style: markerStyle,

    // popup for each marker
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);


  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits= [90,70,50,30,10,-10];
    let colors=["#150202","#5c0909","#c71414","#ea2c2c","#f17373","#facdcd"];
    let labels = [];

    // Add the minimum and maximum.
    let legendInfo = "<h1>Earthquake debt<br />(km)</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" + 
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(map);

});


