const BASE_URL = 'https://www.omdbapi.com/?apikey=5ea6b968&t=';

export const getFilm = title => (
  fetch(BASE_URL + title)
    .then(response => response.json())
);
