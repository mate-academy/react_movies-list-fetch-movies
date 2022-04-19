const API_URL = 'https://omdbapi.com/?apikey=c309e626&t=';

export function getMovie(title: string): Promise<MovieResponse> {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json());
}
