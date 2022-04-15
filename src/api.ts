const API_URL = 'https://omdbapi.com/?apikey=c309e626&t=';

export function GetMovie(title: string): Promise<Movie> {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json());
}
