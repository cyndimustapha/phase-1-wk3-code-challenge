const baseURL = "http://localhost:3000/films";

const listHolder = document.getElementById("films");

document.addEventListener("DOMContentLoaded", () => {
  // Remove the default film item
  document.querySelector(".film.item").remove();
  fetchMovies(baseURL);
});

// Create fetch function to get the data from the db.json
function fetchMovies(baseURL) {
  fetch(baseURL)
    .then((resp) => resp.json())
    .then((movies) => {
      movies.forEach((movie) => {
        displayMovie(movie);
      });
    });
}

// Function to display the titles of the movies as a list
function displayMovie(movie) {
  const list = document.createElement("li");
  list.style.cursor = "pointer"; // Change cursor to pointer
  list.textContent = movie.title;
  listHolder.appendChild(list);
  addClickEvent();
}

// Adding the click event listener
function addClickEvent() {
  let children = listHolder.children;

  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    child.addEventListener("click", () => {
      fetch(`${baseURL}/${i + 1}`)
        .then((res) => res.json())
        .then((movie) => {
          document.getElementById("buy-ticket").textContent = "Buy Ticket";
          setUpMovieDetails(movie);
        });
    });
  }
}

// Posting the movie details
function setUpMovieDetails(funMovie) {
  const preview = document.getElementById("poster");
  preview.src = funMovie.poster;
  // Title
  const movieTitle = document.querySelector("#title");
  movieTitle.textContent = funMovie.title;
  // Runtime
  const movieTime = document.querySelector("#runtime");
  movieTime.textContent = `${funMovie.runtime} minutes`;

  // Description
  const movieDescription = document.querySelector("#film-info");
  movieDescription.textContent = funMovie.description;
  // Showtime
  const showTime = document.querySelector("#showtime");
  showTime.textContent = funMovie.showtime;
  // Available tickets = capacity - tickets sold
  const tickets = document.querySelector("#ticket-num"); // Corrected ID name
  tickets.textContent = funMovie.capacity - funMovie.tickets_sold;
}

// Sold out
const btn = document.getElementById("buy-ticket");

btn.addEventListener("click", function (event) {
  let remainingTickets = document.querySelector("#ticket-num").textContent;
  event.preventDefault();
  if (remainingTickets > 0) {
    document.querySelector("#ticket-num").textContent = remainingTickets - 1;
  } else if (parseInt(remainingTickets, 10) === 0) {
    // Corrected variable name
    btn.textContent = "Sold Out";
  }
});
