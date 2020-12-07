const BASE_URL = 'https://www.omdbapi.com/?apikey=22c8ca35&t=';

export const request = title => (
  fetch(`${BASE_URL}${title}`).then(response => response.json())
);
