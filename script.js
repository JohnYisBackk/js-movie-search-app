"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const searchForm = document.getElementById("searchForm");
const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const resultsTitle = document.getElementById("resultsTitle");
const resultsCount = document.getElementById("resultsCount");

const moviesGrid = document.getElementById("moviesGrid");

// ======================================================
// API SETTINGS
// ======================================================

const baseUrl = "https://api.tvmaze.com/search/shows?q=";

// ======================================================
// SEARCH MOVIES FUNCTION
// ======================================================

async function searchMovies(searchTerm) {
  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  moviesGrid.innerHTML = "";
  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await fetch(`${baseUrl}${searchTerm}`);

    if (!response.ok) {
      throw new Error("Failed to fetch movies.");
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error("No movies found.");
    }

    const delay = Math.floor(Math.random() * 800) + 600;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });

    resultsTitle.textContent = `Results for "${searchTerm}"`;
    resultsCount.textContent = `${data.length} movies`;

    renderMovies(data);
    loading.classList.add("hidden");
  } catch (error) {
    loading.classList.add("hidden");
    errorMessage.classList.remove("hidden");

    resultsCount.textContent = "0 movies";
    console.error(error);
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

// ======================================================
// RENDER MOVIES FUNCTION
// ======================================================

function renderMovies(movies) {
  moviesGrid.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("article");
    movieCard.classList.add("movie-card");

    const poster = movie.show.image
      ? movie.show.image.medium
      : "https://placehold.co/400x600?text=No+Image";

    const title = movie.show.name;
    const year = movie.show.premiered
      ? movie.show.premiered.slice(0, 4)
      : "Unknown";
    const type = movie.show.type;

    movieCard.innerHTML = `
  <div class="poster-wrap">
  <img src="${poster}" alt="${title}">
  </div>

  <div class="movie-info">
    <h3>${title}</h3>
  
  
  <div class="movie-meta">
    <span>${year}</span>
     <span>${type}</span>
    </div>
   </div>
  `;

    moviesGrid.appendChild(movieCard);
  });
}

// ======================================================
// HANDLE SEARCH FUNCTION
// ======================================================

function handleSearch(e) {
  e.preventDefault();

  const value = movieInput.value.trim();
  if (value === "") return;

  searchMovies(value);
}

// ======================================================
// FORM SUBMIT EVENT
// ======================================================

searchForm.addEventListener("submit", handleSearch);

// ======================================================
// INITIAL LOAD
// ======================================================

searchMovies("batman");
