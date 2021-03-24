export const BASE_URL
  = 'https://www.omdbapi.com/?apikey=de242cb8&t=';

export const getMovie = title => (
  fetch(`${BASE_URL}${title}`)
    .then(response => response.json())
);
