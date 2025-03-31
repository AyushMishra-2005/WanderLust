// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// 1st star-box
document.querySelectorAll('.rating input').forEach((star) => {
  star.addEventListener('change', () => {
    console.log(`Selected rating: ${star.value}`);
  });
});


//2nd starBox
function updateStars() {
  document.querySelectorAll(".stars").forEach(starContainer => {
    let rating = parseInt(starContainer.getAttribute("data-rating"));
    let stars = starContainer.querySelectorAll(".star");

    stars.forEach(star => {
      let starValue = parseInt(star.getAttribute("data-value"));
      star.classList.toggle("glow", starValue <= rating);
    });
  });
}
// Apply glow effect after the DOM loads
updateStars();



document.addEventListener("DOMContentLoaded", function () {
  console.log("Leaflet Loaded:", typeof L !== "undefined");
 
  let latitude = lat;
  let longitude = lon;

  if (typeof L === "undefined") {
    alert("Leaflet.js failed to load! Try using the local version.");
    return;
  }

  // Initialize the map at the given coordinates
  var map = L.map('map').setView([latitude, longitude], 10); // [Latitude, Longitude], Zoom Level

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker at the given coordinates
  L.marker([latitude, longitude]).addTo(map)
    .bindPopup(`${placeName}: ${latitude}° N, ${longitude}° E`)
    .openPopup();
});










