const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=422c2f98&t=';

export const getMovie = title => fetch(`${API_URL}${title}`)
  .then(response => response.json());
