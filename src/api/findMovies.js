const API_FIND_MOVIES
  = 'https://www.omdbapi.com/?i=tt3896198&apikey=2cb09ab0&t=';

export function findMoviesFromOMDb(title) {
  return fetch(`${API_FIND_MOVIES}${title}`)
    .then(movies => movies.json());
}
