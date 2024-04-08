document.addEventListener('DOMContentLoaded', () => {
  const baseURL = 'http://localhost:3000';

  // Function to make GET requests
  async function fetchData(endpoint) {
      try {
          const response = await fetch(`${baseURL}/${endpoint}`);
          if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`);
              return null;
          }
          return await response.json();
      } catch (error) {
          console.error('Error:', error);
          return null;
      }
  }

  // Function to update movie details on the page
  function updateMovieDetails(movie) {
      const poster = document.getElementById('poster');
      const title = document.getElementById('title');
      const runtime = document.getElementById('runtime');
      const filmInfo = document.getElementById('film-info');
      const showtime = document.getElementById('showtime');
      const ticketNum = document.getElementById('ticket-num');
      const buyTicketBtn = document.getElementById('buy-ticket');

      poster.src = movie.poster;
      title.textContent = movie.title;
      runtime.textContent = `${movie.runtime} minutes`;
      filmInfo.textContent = movie.description;
      showtime.textContent = movie.showtime;
      ticketNum.textContent = `${movie.capacity - movie.tickets_sold} remaining tickets`;

      buyTicketBtn.addEventListener('click', (event) => buyTicket(movie, event)); // Pass event object
  }

  // Function to buy ticket
  async function buyTicket(movie, event) {
      event.preventDefault(); // Prevent default form submission behavior

      if (movie.capacity - movie.tickets_sold === 0) {
          console.log('Movie is sold out');
          return;
      }

      const updatedTicketsSold = movie.tickets_sold + 1;
      try {
          const response = await fetch(`${baseURL}/films/${movie.id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ tickets_sold: updatedTicketsSold })
          });
          if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`);
              return;
          }
          updateMovieDetails({ ...movie, tickets_sold: updatedTicketsSold });
      } catch (error) {
          console.error('Error:', error);
      }
  }

  // Function to populate movie list
  async function populateMovieList() {
      const films = await fetchData('films');
      if (!films) return;

      const filmsList = document.getElementById('films');
      filmsList.innerHTML = '';
      films.forEach(film => {
          const li = document.createElement('li');
          li.textContent = film.title;
          li.className = 'film item';
          filmsList.appendChild(li);
          li.addEventListener('click', () => updateMovieDetails(film));
      });
  }

  // Initial setup
  async function initialize() {
      try {
          const firstMovie = await fetchData('films/1');
          if (firstMovie) {
              updateMovieDetails(firstMovie);
          }
          populateMovieList();
      } catch (error) {
          console.error('Error:', error);
      }
  }

  initialize();
});
