const API = 'https://www.omdbapi.com/?apikey=b9cb9612&t=';

export function getMovies(url: string) {
  return fetch(`${API}${url}`)
    .then(response => {
      return response.json();
    });
}
