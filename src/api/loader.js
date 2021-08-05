const BASE_URL = 'https://www.omdbapi.com/?apikey=5e693755&t=';

export const loadMovie = searchInput => fetch(`${BASE_URL}${searchInput}`)
  .then(response => response.json())
  .then(serverResponse => serverResponse);
