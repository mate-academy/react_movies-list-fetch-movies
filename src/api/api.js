const API_URL = `https://www.omdbapi.com/?apikey=98c365e7&t=`;

export const getMovie = title => fetch(`${API_URL}&t=${title}`)
  .then(response => response.json())
  .catch((error) => {
    throw new Error(`${error.status} - ${error.statusText}`);
  });
