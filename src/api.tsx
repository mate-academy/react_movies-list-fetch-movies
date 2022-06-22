// const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=84e5c2a8';
const BASE_URL = 'https://www.omdbapi.com/?apikey=84e5c2a8';

export function searchMovies(title: string): Promise<Movie> {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
}
