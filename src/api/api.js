const API_URL = `https://www.omdbapi.com/?apikey=7a38d53a&t=`;

export function getMovie(title) {
  return fetch(`${API_URL}${title}`)
    .then((responce) => {
      if (!responce.ok) {
        throw new Error(`${responce.status} - ${responce.statusText}`);
      }

      return responce.json();
    });
}
