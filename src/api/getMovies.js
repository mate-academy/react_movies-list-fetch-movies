const API_KEY = 'e8f0b8eb';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&t=`;

export const getMovie = title => fetch(`${API_URL}${title}`)
  .then(result => result.json());
