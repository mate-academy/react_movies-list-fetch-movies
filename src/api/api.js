export const BASE_URL
  = 'https://www.omdbapi.com/?apikey=e2844a57&t=';

export const getMovie = title => (
  fetch(`${BASE_URL}${title}`)
    .then(response => response.json())
);
