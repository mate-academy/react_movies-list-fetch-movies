const API_URL = `https://www.omdbapi.com/?apikey=4977cd1d&t`;

export function findMovie(title) {
  return fetch(`${API_URL}=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
