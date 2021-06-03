const API_KEY = 'ed153c24';
const API_URL = 'https://www.omdbapi.com';

export const requestByTitle = title => fetch(
  `${API_URL}/?apikey=${API_KEY}&t=${title}`,
)
  .then(response => response.json());
