const BASE_URL = 'https://www.omdbapi.com/?apikey=dbf4ee47&t=';

export const getFilm = title => (
  fetch(BASE_URL + title)
    .then(response => response.json())
);
