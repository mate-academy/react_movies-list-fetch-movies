const BASE_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=2881d992`;

export const loadMovie = title => fetch(`${BASE_URL}&t=${title}`)
  .then(response => response.json())
  .catch((error) => {
    throw new Error(error);
  });
