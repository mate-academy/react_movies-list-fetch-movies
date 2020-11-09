const MOVIE_URL = 'http://www.omdbapi.com/?apikey=d905df00&t=';

export function getMovie(title) {
  return fetch(MOVIE_URL + title)
    .then(response => response.json());
}
