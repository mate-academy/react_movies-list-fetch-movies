
const BASE_URL = 'https://www.omdbapi.com';

export const getFilm = title => (
  fetch(`${BASE_URL}/?apikey=b634e39f&t=${title}`)
    .then(response => response.json())
);
