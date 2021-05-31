const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=160d8ba';

export function getMoviesFromApi(title) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
