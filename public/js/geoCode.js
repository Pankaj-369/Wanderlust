document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("location-input");
  const latInput = document.getElementById("lat");
  const lngInput = document.getElementById("lng");

  input.addEventListener("change", () => {
    const query = input.value;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;

          // Update hidden fields to be saved
          latInput.value = lat;
          lngInput.value = lon;

          // Optional: update preview map
          if (window.map) {
            map.setView([lat, lon], 13);
            if (window.marker) {
              map.removeLayer(marker);
            }
            window.marker = L.marker([lat, lon]).addTo(map).bindPopup(query).openPopup();
          }
        } else {
          alert("Location not found");
        }
      });
  });
});
