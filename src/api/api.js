// eslint-disable-next-line
const API_URL = `https://www.omdbapi.com/?apikey=49929d59&t=`;

export function getMovie(title) {
  return fetch(`${API_URL}${title}`)
    .then((responce) => {
      if (!responce.ok) {
        throw new Error(`${responce.status} - ${responce.statusText}`);
      }

      return responce.json();
    });
}
