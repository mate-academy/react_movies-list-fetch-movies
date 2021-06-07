const API_KEY = '45e29ffb';
const API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}`;

export const loadMovie = title => fetch(`${API_URL}&t=${title}`)
  .then(response => response.json())
  .catch((error) => {
    throw new Error(error);
  });
