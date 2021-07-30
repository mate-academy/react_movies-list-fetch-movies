const api = `https://www.omdbapi.com/?apikey=53f175f9&t=`;

export async function getMovie(value) {
  return fetch(api + value)
    .then(response => response.json())
    .catch(error => error);
}
