//constant variable for the query URL
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// createing myMap
const myMap = L.map("map", { center: [36.966428, -95.844032], zoom: 2 });

//adding tile layer to the map 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//fetch json data from the url and create markers and adds legend
d3.json(queryUrl).then(data => {
    createMarkers(data.features);
    addLegend();
});

//this function create markers and adds popups
function createMarkers(earthquakeData) {
    earthquakeData.forEach(earthquake => {
        const markerSize = earthquake.properties.mag * 5;
        const depth = earthquake.geometry.coordinates[2];
        const markerColor = getColor(depth);
        const marker = L.circleMarker(
            [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
                radius: markerSize,
                fillColor: markerColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            }
        ).addTo(myMap);

        marker.bindPopup(
            `<h3>Location: ${earthquake.properties.place}</h3><hr>` +
            `<p>Date and Time: ${new Date(earthquake.properties.time)}</p><hr>` +
            `<p>Magnitude: ${earthquake.properties.mag}</p><p>Depth: ${depth} km</p>`
        );
    });
}

//this function returns the color based on the depth
function getColor(depth) {
  return depth < 10 ? '#7FFF00' : 
         depth < 30 ? '#32CD32' : 
         depth < 50 ? '#228B22' : 
         depth < 70 ? '#8B0000' : 
         depth < 90 ? '#B22222' : 
                      '#8B0000';  
}


//function to add legend
function addLegend() {
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = () => {
      let legendDiv = L.DomUtil.create('div', 'info legend');
      let colorGrades = [-10, 10, 30, 50, 70, 90];

      // Generate legend HTML using map and join
      let legendContent = colorGrades.map((grade, index) => {
          let bgColor = getColor(grade + 1);
          let labelText = grade + (colorGrades[index + 1] ? '&ndash;' + colorGrades[index + 1] : '+');
          return `<i style="background:${bgColor}"></i> ${labelText}`;
      }).join('<br>');

      // Add legend content to legendDiv
      legendDiv.innerHTML = legendContent;

      // Apply inline styles to legendDiv
      legendDiv.style.padding = '12px';
      legendDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';

      // Apply styles to legend item icons
      let legendIcons = legendDiv.querySelectorAll('i');
      legendIcons.forEach(icon => {
          icon.style.float = 'left';
          icon.style.width = '5px';
          icon.style.height = '15px';
          icon.style.marginRight = '9px';
          icon.style.opacity = '1';
      });

      return legendDiv;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
}



