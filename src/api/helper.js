const BASE_URL = 'https://www.omdbapi.com/?apikey=6ce2caab&t=';

export const getTitle = url => (
  fetch(`${BASE_URL}${url}`)
    .then(response => response.json())
);
