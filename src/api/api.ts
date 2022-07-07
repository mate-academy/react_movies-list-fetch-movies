const API_URL = 'http://www.omdbapi.com/?apikey=63452f61&t=';

export function getMovie(title: string) :Promise<Movie> {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json());
}
