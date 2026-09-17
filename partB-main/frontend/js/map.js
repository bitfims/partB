requireLogin();



 map = L.map("map").setView([-22.9773, 30.44366], 16);

map.setMinZoom(15);





//change
map.on("click" , function(e) {
  console.log(e.latlng.lat , e.latlng.lng);
});
//function

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function markerColor(status) {
  if (status === "Completed") return "green";
  if (status === "Planned") return "gold";
  return "red";
}

async function loadMap() {
  const response = await fetch("/api/projects");
  const projects = await response.json();

  projects.forEach(p => {
    const color = markerColor(p.status);
    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 1px 5px #000"></div>`,
      iconSize: [18,18]
    });

    L.marker([p.latitude, p.longitude], {icon}).addTo(map).bindPopup(`
      <b>${p.name}</b><br>
      Status: ${p.status}<br>
      Location: ${p.location}<br>
      Affected: ${p.affectedArea}<br>
      Expected completion: ${p.endDate}
    `);
  });
}
loadMap();
