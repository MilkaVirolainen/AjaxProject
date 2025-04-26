// Odotetaan että dokumentti on valmis
document.addEventListener('DOMContentLoaded', function() {

  const theaterSelect = document.getElementById('theaterSelect');
  const moviesContainer = document.getElementById('moviesContainer');

  // Haetaan teatterit Finnkino APIsta
  fetch('https://www.finnkino.fi/xml/TheatreAreas/')
      .then(response => response.text())
      .then(data => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(data, "text/xml");
          const areas = xml.getElementsByTagName('TheatreArea');

          // Lisätään vaihtoehdot dropdowniin
          for (let area of areas) {
              const id = area.getElementsByTagName('ID')[0].textContent;
              const name = area.getElementsByTagName('Name')[0].textContent;

              if (id !== '0') { 
                  const option = document.createElement('option');
                  option.value = id;
                  option.textContent = name;
                  theaterSelect.appendChild(option);
              }
          }
      });

  // Kun valitaan teatteri
  theaterSelect.addEventListener('change', function() {
      const selectedId = this.value;
      if (selectedId !== '0') {
          fetchMovies(selectedId);
      }
  });

  // Funktio hakee elokuvat valitulle teatterille
  function fetchMovies(theaterId) {

      moviesContainer.innerHTML = ''; // Tyhjennetään vanhat tulokset

      fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
          .then(response => response.text())
          .then(data => {
              const parser = new DOMParser();
              const xml = parser.parseFromString(data, "text/xml");
              const shows = xml.getElementsByTagName('Show');

              // Käydään läpi kaikki näytökset
              for (let show of shows) {

                  const title = show.getElementsByTagName('Title')[0].textContent;
                  const image = show.getElementsByTagName('EventLargeImagePortrait')[0].textContent;
                  const startTime = show.getElementsByTagName('dttmShowStart')[0].textContent;

                  const movieCard = document.createElement('div');
                  movieCard.className = 'movie-card';

                  movieCard.innerHTML = `
                      <img src="${image}" alt="${title}">
                      <h3>${title}</h3>
                      <p>Alkaa: ${new Date(startTime).toLocaleString('fi-FI')}</p>
                  `;

                  moviesContainer.appendChild(movieCard);
              }
          });
  }
});