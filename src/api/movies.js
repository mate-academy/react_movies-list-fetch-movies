const BASE_URL = 'https://www.omdbapi.com/?apikey=2dfeee8&t=';

export const getMovie = title => (
  fetch(BASE_URL + title.toLowerCase())
    .then(response => response.json())
);
