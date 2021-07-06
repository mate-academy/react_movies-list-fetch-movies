const BASE_URL = 'https://www.omdbapi.com';
const url = `${BASE_URL}/?apikey=106c9773&t=`;

export const getMovie = title => (
  fetch(`${url}${title}`)
    .then(response => (!response.ok
      ? new Error(`${response.status} - ${response.statusText}`)
      : response.json()))
);
