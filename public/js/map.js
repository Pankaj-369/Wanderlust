const map = L.map('map').setView([cords[1], cords[0]], 13);

L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=N6DyApA3NciVe9cOKwMP', {
  attribution: '&copy; MapTiler & OpenStreetMap contributors',
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);

console.log(cords);

L.marker([cords[1], cords[0]])
  .addTo(map)
  .bindPopup(`<strong>${listing.title}</strong><br>${listing.location}`)
  .openPopup();


// nearby.forEach(l => {
//   if (l.coordinates) {
//     const [lng, lat] = l.coordinates;
//     L.marker([lat, lng])
//       .addTo(map)
//       .bindPopup(`<strong>${l.title}</strong><br>${l.location}`);
//   }
// });
